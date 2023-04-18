const path = require('path');
const debug = require('debug')('serverless-cd:application');
const { default: loadApplication } = require('@serverless-devs/load-application');
const { fs, lodash: _ } = require('@serverless-cd/core');
const os = require('os');

const appModel = require('../models/application.mode');
const taskModel = require('../models/task.mode');
const orgModel = require('../models/org.mode');

const webhookService = require('./webhook.service');
const orgService = require('./org.service');
const gitService = require('./git.service');

const { ValidationError, unionId, checkNameAvailable } = require('../util');

async function listByOrgName(orgName = '') {
  const { id: orgId } = await orgModel.getOwnerOrgByName(orgName);
  const data = await appModel.listAppByOwnerOrgId(orgId);
  if (_.isNil(data)) {
    return {};
  }
  return data;
}

async function preview(orgName, body = {}) {
  const { repo_id: providerRepoId, provider, name } = body;

  checkNameAvailable(name);

  const { id: owner_org_id } = await orgModel.getOwnerOrgByName(orgName);
  const checkByName = await appModel.getAppByAppName({
    owner_org_id,
    name,
  });
  if (!_.isEmpty(checkByName)) {
    throw new ValidationError('应用 name 已存在，请换一个名称');
  }

  if (provider && providerRepoId) {
    const checkByRepoId = await appModel.getAppByProvider({
      provider,
      providerRepoId,
    });

    if (!_.isEmpty(checkByRepoId)) {
      throw new ValidationError('代码仓库已绑定，请勿重新绑定');
    }
  }
}

async function create(orgId, orgName, body) {
  await preview(orgName, body);

  const {
    repo,
    repo_owner,
    repo_url,
    repo_id: providerRepoId,
    description,
    provider,
    environment,
    name,
    template,
  } = body;
  const appId = unionId();
  const webHookSecret = unionId();
  const providerToken = await orgService.getProviderToken(orgName, provider);
  debug(`providerToken: ${providerToken}`);
  debug('start add webhook');
  await webhookService.add({
    repo_owner,
    repo,
    token: providerToken,
    webHookSecret,
    appId,
    provider,
  });
  debug('start create app');
  const ownerOrg = await orgModel.getOwnerOrgByName(orgName);
  await appModel.createApp({
    name,
    id: appId,
    org_id: orgId,
    owner_org_id: _.get(ownerOrg, 'id'),
    description,
    repo_owner,
    provider,
    environment,
    template,
    repo_id: providerRepoId,
    repo_name: repo,
    repo_url,
    repo_webhook_secret: webHookSecret,
  });
  debug('create app success');
  return { id: appId };
}

async function checkFolderEmpty(execDir) {
  try {
    const res = await fs.readdir(execDir);
    if (res.length === 0) {
      return { isFolderEmpty: true };
    } else {
      return { isFolderEmpty: false };
    }
  } catch (e) {
    return { isFolderEmpty: true };
  }
}

/**
 * 幂等
 * @param {*} param0
 * @param {*} body
 * @returns
 */
async function createByTemplate({ type, orgName }, body) {
  const { provider, appId: oldAppId, repo_owner, repo } = body;
  const appId = oldAppId || unionId();
  const execDir = path.join(os.tmpdir(), repo_owner, repo);
  if (type != 'initTemplate') {
    const { isFolderEmpty } = await checkFolderEmpty(execDir);
    if (isFolderEmpty) {
      return { isFolderEmpty };
    }
  }
  // 1. 初始化模版
  if (type === 'initTemplate') {
    const { template, parameters = {}, content } = body;
    if (_.isEmpty(template)) {
      throw new ParamsValidationError('参数校验失败，template必填 ');
    }
    await initTemplate({
      template,
      parameters,
      execDir,
      appName: appId,
      access: 'default',
      content,
    });
    debug('init template');
    return { appId };
  }
  // 2. 初始化Repo
  if (type === 'initRepo') {
    const token = await orgService.getProviderToken(orgName, provider);
    const res = await gitService.createRepoWithWebhook({
      repo_owner,
      repo,
      token,
      secret: unionId(),
      appId,
      provider,
    });
    return { appId, ...res };
  }
  // 3. 初始化commit信息
  if (type === 'initCommit') {
    const token = await orgService.getProviderToken(orgName, provider);
    await gitService.initAndCommit({
      provider,
      execDir,
      repoUrl: `https://${token}@${provider}.com/${repo_owner}/${repo}.git`,
      branch: 'master',
    });
    return {};
  }
  // 4. 提交代码
  if (type === 'push') {
    const token = await orgService.getProviderToken(orgName, provider);
    const data = await gitService.pushFile({
      repo_owner,
      repo,
      execDir,
      branch: 'master',
      provider,
      token,
    });
    return data;
  }
  throw new ValidationError('请求路径不正确');
}

async function getAppById(appId = '') {
  return await appModel.getAppById(appId);
}

async function removeEnv(appId, envName) {
  const appDetail = await appModel.getAppById(appId);
  if (_.isEmpty(appDetail)) {
    throw new ValidationError('暂无应用信息');
  }

  const { environment } = appDetail;
  if (_.has(environment, envName)) {
    debug('Start remove task');
    const taskList = await taskModel.deleteByAppIdAndEnvName(appId, envName);
    debug(`Delete by appId: ${JSON.stringify(taskList)}`);
  }

  debug('Start update app');
  _.unset(environment, envName);
  await appModel.updateAppById(appId, { ...appDetail, environment });
  debug('Update app successfully');
}

async function update(appId, params) {
  const appDetail = await getAppById(appId);
  if (_.isEmpty(appDetail)) {
    throw new ValidationError('没有找到此应用');
  }

  await appModel.updateAppById(appId, { ...appDetail, ...params });
}

async function remove(orgName, appId, isDeleteRepo) {
  const appDetail = await getAppById(appId);

  if (_.isEmpty(appDetail)) {
    throw new ValidationError('暂无应用信息');
  }

  const { repo_owner, repo_name, provider } = appDetail;
  const token = await orgService.getProviderToken(orgName, provider);

  debug('Start remove task');
  const taskList = await taskModel.deleteByAppId(appId);
  debug(`Delete by appId: ${JSON.stringify(taskList)}`);

  debug('Start remove app');
  await appModel.deleteAppById(appId);
  debug('Removed app successfully');
  debug(`isDeleteRepo: ${isDeleteRepo}`);
  if (isDeleteRepo) {
    debug(`Start remove ${provider} repo_name: ${repo_name}`);
    await gitService.removeRepo({ repo_owner, repo_name, orgName, provider });
    debug(`Removed ${provider} repo_name: ${repo_name} successfully`);
  } else {
    debug(`Removed webhook:\repo_owner: ${repo_owner}, repo_name: ${repo_name}, appId: ${appId}`);
    await webhookService.remove({ repo_owner, repo_name, token, appId, provider });
    debug(`Removed webhook successfully`);
  }
}

async function transfer(appId, transferOrgName) {
  const transferOwnerOrg = await orgModel.getOwnerOrgByName(transferOrgName);
  const transferOrgId = _.get(transferOwnerOrg, 'id');
  if (_.isEmpty(transferOrgId)) {
    throw new ValidationError(`没有找到 ${transferOrgName} 团队`);
  }
  await update(appId, { org_id: transferOrgId, owner_org_id: transferOrgId });
}

/**
 * 初始化模版
 */
async function initTemplate({ template, parameters, execDir, appName, content }) {
  await fs.remove(execDir);
  debug(`Init template: ${(template, parameters, execDir, appName)}`);
  const options = {
    dest: path.dirname(execDir),
    appName,
    parameters: { serviceName: 'web-framework-1' },
    projectName: path.basename(execDir),
  };
  await loadApplication(template, options);
  await fs.writeFile(path.join(execDir, 'serverless-pipeline.yaml'), content, (err) => {
    if (err) {
      return;
    }
    debug('文件写入成功');
  });
}

module.exports = {
  initTemplate,
  preview,
  listByOrgName,
  create,
  update,
  transfer,
  remove,
  removeEnv,
  getAppById,
  createByTemplate,
};
