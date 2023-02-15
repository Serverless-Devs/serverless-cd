const debug = require('debug')('serverless-cd:git');
const git = require('@serverless-cd/git-provider');
const { checkFile } = require('@serverless-cd/git');
const { CD_PIPELINE_YAML } = require('@serverless-cd/config');
const _ = require('lodash');

const userService = require('./user.service');
const appService = require('./application.service');
const { ValidationError } = require('../util');

async function getProviderToken(orgId, provider) {
  // 获取 owner 代码仓库的 token
  const result = await userService.getOrganizationOwnerIdByOrgId(orgId);
  const token = _.get(result, `third_part.${provider}.access_token`, '');
  if (!token) {
    throw new ValidationError(`没有找到${provider}.access_token`);
  }
  return token;
}

async function getProviderOrgs(orgId, provider) {
  const token = await getProviderToken(orgId, provider);
  const providerClient = git(provider, { access_token: token });
  try {
    return await providerClient.listOrgs();
  } catch (err) {
    if (err.code === 401 && err.message === 'Bad credentials') {
      throw new ValidationError('Github token 无效，请重新配置');
    }
    throw err;
  }
}

async function getProviderRepos(orgId, provider, { org } = {}) {
  const token = await getProviderToken(orgId, provider);
  const providerClient = git(provider, { access_token: token });

  const applicationResult = await appService.listByOrgId(orgId);
  const applicationList = _.get(applicationResult, 'result', []);

  try {
    let rows;
    if (org) {
      rows = await providerClient.listOrgRepos(org);
    } else {
      rows = await providerClient.listRepos();
    }

    if (!_.isEmpty(applicationList)) {
      let mapRows = [];
      _.forEach(applicationList, (applicationItem) => {
        mapRows = _.map(rows, (item) => {
          item.disabled = item.id === Number(applicationItem.provider_repo_id);
          return item;
        });
      });
      return mapRows;
    }
    return rows;
  } catch (err) {
    if (err.code === 401 && err.message === 'Bad credentials') {
      throw new ValidationError('Github token 无效，请重新配置');
    }
    throw err;
  }
}

async function getBranches(orgId, provider, query) {
  const token = await getProviderToken(orgId, provider);
  const providerClient = git(provider, { access_token: token });

  try {
    return await providerClient.listBranches(query);
  } catch (err) {
    if (err.code === 401 && err.message === 'Bad credentials') {
      throw new ValidationError('Github token 无效，请重新配置');
    }
    throw err;
  }
}

async function checkProviderFile(orgId, provider, body = {}) {
  const token = await getProviderToken(orgId, provider);
  return await checkFile({ ...body, token, file: CD_PIPELINE_YAML })
}

async function putFile(orgId, provider, body) {
  const token = await getProviderToken(orgId, provider);
  const providerClient = git(provider, { access_token: token });
  return await providerClient.putFile(body);
}

module.exports = {
  putFile,
  checkProviderFile,
  getBranches,
  getProviderOrgs,
  getProviderRepos,
};