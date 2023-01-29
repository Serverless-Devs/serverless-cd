const _ = require('lodash');
const debug = require('debug')('serverless-cd:application');

const { ValidationError, unionId } = require('../util');
const appModel = require('../models/application.mode');
const taskModel = require('../models/task.mode');

const webhookService = require('./webhook.service');
const userService = require('./user.service');

async function listByOrgId(orgId = '') {
  const data = await appModel.listAppByOrgId(orgId);
  if (_.isNil(data)) {
    return {};
  }
  return data;
}

async function create(orgId, token, body) {
  const { repo, owner, repo_url, provider_repo_id: providerRepoId, description, provider, environment } = body;

  const application = await appModel.getAppByProvider({
    orgId,
    provider,
    providerRepoId,
  });
  if (!_.isEmpty(application)) {
    throw new ValidationError('代码仓库已绑定，请勿重新绑定');
  }

  const appId = unionId();
  const webHookSecret = unionId();
  debug('start add webhook');
  await webhookService.add(owner, repo, token, webHookSecret, appId);
  debug('start create app');
  await appModel.createApp({
    id: appId,
    org_id: orgId,
    description,
    owner,
    provider,
    environment,
    provider_repo_id: providerRepoId,
    repo_name: repo,
    repo_url,
    webhook_secret: webHookSecret,
  });
  debug('create app success');
  return { id: appId };
}

async function getAppById(appId = '') {
  return await appModel.getAppById(appId);
}

async function update(appId, params) {
  const appDetail = await getAppById(appId);
  if (_.isEmpty(appDetail)) {
    throw new ValidationError('没有找到此应用');
  }

  await appModel.updateAppById(appId, { ...appDetail, ...params });
}

async function remove(orgId, userId, appId) {
  const appDetail = await getAppById(appId);

  if (_.isEmpty(appDetail)) {
    throw new ValidationError('暂无应用信息');
  }

  const { owner, repo_name, provider } = appDetail;
  const token = await userService.getProviderToken(orgId, userId, provider);

  debug('Start remove task');
  const taskList = await taskModel.deleteByAppId(appId);
  debug(`Delete by appId: ${JSON.stringify(taskList)}`);

  debug('Start remove app');
  await appModel.deleteAppById(appId);
  debug('Removed app successfully');

  debug(`Removed webhook:\nowner: ${owner}, repo_name: ${repo_name}, appId: ${appId}`);
  await webhookService.remove(owner, repo_name, token, appId);
  debug(`Removed webhook successfully`);
}

module.exports = {
  listByOrgId,
  create,
  update,
  remove,
  getAppById,
};
