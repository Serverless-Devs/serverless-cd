const _ = require('lodash');
const { getAppById, getOrganizationOwnerIdByOrgId } = require('../model');

module.exports = async function (provider, appId) {
  console.log(`Find app config by appId: ${appId}`);
  const applicationResult = await getAppById(appId);
  if (_.isEmpty(applicationResult)) {
    throw new Error(`Not found application by id ${appId}`);
  }
  const ownerOrgId = _.get(applicationResult, 'owner_org_id', '');

  console.log(`Get organization owner config by orgId ${ownerOrgId}`);
  const userConfig = await getOrganizationOwnerIdByOrgId(ownerOrgId);

  console.log('get config');
  const accessToken = _.get(userConfig, `third_part.${provider}.access_token`, '');
  if (_.isEmpty(accessToken)) {
    throw new Error(`${provider} authorization is invalid`);
  }


  return {
    appId,
    accessToken,
    userId: '', // _.get(userConfig, 'id', ''), // 如果是 webhook 触发则不传递 user_id，做 api 审计
    secrets: _.get(userConfig, 'secrets', {}),
    repoId: _.get(applicationResult, 'provider_repo_id', ''),
    environment: _.get(applicationResult, 'environment', {}),
    owner: _.get(applicationResult, 'owner', ''),
    webhook_secret: _.get(applicationResult, 'webhook_secret', ''),
  };
}
