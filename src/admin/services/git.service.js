const debug = require('debug')('serverless-cd:git');
const git = require('@serverless-cd/git-provider');
const { checkFile, initConfig, addCommit, setRemote, push } = require('@serverless-cd/git');
const { CD_PIPELINE_YAML } = require('@serverless-cd/config');
const userService = require('./user.service');
const path = require('path');
const appService = require('./application.service');
const webhookService = require('./webhook.service');
const { ValidationError } = require('../util');
const _ = require('lodash');
const { fs } = require('@serverless-cd/core');

async function getProviderToken(orgId, provider) {
  // 获取 owner 代码仓库的 token
  const result = await userService.getOrganizationOwnerIdByOrgId(orgId);
  const token = _.get(result, `third_part.${provider}.access_token`, '');
  if (!token) {
    throw new ValidationError(`没有找到${provider}.access_token`);
  }
  return token;
}

async function getProviderClient(orgId, provider) {
  const token = await getProviderToken(orgId, provider);
  return git(provider, { access_token: token });
}

async function getProviderOrgs(orgId, provider) {
  const providerClient = await getProviderClient(orgId, provider);
  return await providerClient.listOrgs();
}

async function getProviderRepos(orgId, orgName, provider, { org } = {}) {
  const providerClient = await getProviderClient(orgId, provider);
  const applicationResult = await appService.listByOrgName(orgName);

  let rows;
  if (org) {
    rows = await providerClient.listOrgRepos(org);
  } else {
    rows = await providerClient.listRepos();
  }

  if (!_.isEmpty(applicationResult)) {
    return _.map(rows, (item) => {
      for (const applicationItem of applicationResult) {
        if (item.id === Number(applicationItem.provider_repo_id)) {
          item.disabled = true;
          return item;
        }
      }
      return item;
    });
  }
  return rows;
}

async function getBranches(orgId, provider, query) {
  const providerClient = await getProviderClient(orgId, provider);
  return await providerClient.listBranches(query);
}

async function checkProviderFile(orgId, provider, body = {}) {
  const token = await getProviderToken(orgId, provider);
  return await checkFile({ file: CD_PIPELINE_YAML, ...body, token });
}

async function putFile(orgId, provider, body) {
  const { owner, repo, ref, sha } = body;
  const providerClient = await getProviderClient(orgId, provider);
  // TODO: 直接创建分支，后续守帅会优化
  try {
    // TODO: 如果分支存在，创建会报错
    await providerClient.octokit.request('POST /repos/{owner}/{repo}/git/refs', body);
  } catch (error) {}
  try {
    // TODO: 如果文件存在，putFile会报错
    return await providerClient.putFile(body);
  } catch (error) {}
}

async function getUser(provider, access_token) {
  const providerClient = git(provider, { access_token });
  return await providerClient.user();
}

/**
 * 创建新的Repo并加上Webhook
 * 1. create Repo
 * 2. create Webhook
 */
async function createRepoWithWebhook({ owner, repo, token, secret, appId, provider }) {
  const providerClient = git(provider, { access_token: token });

  const hasRepoResult = await providerClient.hasRepo({ owner, repo });
  if (!_.get(hasRepoResult, 'isExist')) {
    debug(`Repo not exist, create repo ${(owner, repo)}`);
    await providerClient.createRepo({
      name: repo,
      private: false,
      description: 'Create by serverles-cd',
    });
  }
  debug(`Repo is exist`);
  debug(`Add webhook ${owner} ${repo} ${token} ${secret} ${appId} ${provider}`);
  await webhookService.add({ owner, repo, token, webHookSecret: secret, appId, provider });
}

/**
 * git init
 * git config
 * git remote add origin
 *
 * git add .
 * git commit
 * @param {*} param0
 */
async function initAndCommit({ provider, repoUrl, execDir, branch }) {
  let gitClient = null;
  if (!fs.existsSync(path.join(execDir, '.git'))) {
    debug('git init config');
    gitClient = await initConfig({
      userName: 'serverless-cd',
      userEmail: 'serverless@serverless-cd',
      execDir,
    });
  }
  debug(`git set remote: ${repoUrl}`);
  try {
    await setRemote(
      {
        provider_platform: provider,
        repoUrl,
        execDir,
      },
      gitClient,
    );
  } catch (error) {
    // ignore error
  }

  debug(`git add and commit`);
  await addCommit(
    {
      execDir,
      branch: branch || 'master',
    },
    gitClient,
  );
}

/**
 * git push
 */
async function pushFile({ execDir, branch }) {
  debug(`git push`);
  await push({
    execDir,
    branch: branch || 'master',
  });
}

module.exports = {
  getUser,
  putFile,
  checkProviderFile,
  getBranches,
  getProviderOrgs,
  getProviderRepos,
  createRepoWithWebhook,
  initAndCommit,
  pushFile,
};
