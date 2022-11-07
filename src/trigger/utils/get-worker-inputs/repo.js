const _ = require('lodash');
const findUser = require('../../model/user').findOne;
const findApplication = require('../../model/application').find;

async function getRepoConfig (provider, repoId, userId) {
  console.log('find user');
  const userConfig = await findUser(userId);
  if (_.isEmpty(userConfig)) {
    throw new Error(`User(${userId}) not found`);
  }
  console.log('user id: ', userConfig.id);
  const providerConfig = _.get(userConfig, `third_part.${provider}`);
  const accessToken = _.get(providerConfig, 'access_token', '');
  if (_.isEmpty(accessToken)) {
    throw new Error(`${provider} authorization is invalid`);
  }
  console.log('find user success');

  console.log('find application');
  const application = await findApplication({ provider, provider_repo_id: repoId, user_id: userId });
  const applicationResult = _.get(application, 'result', []);
  if (applicationResult.length !== 1) {
    throw new Error(`Get ${applicationResult.length} applications, one is expected`);
  }
  const appId = _.get(applicationResult, '[0].id', null);
  if (_.isEmpty(appId)) {
    throw new Error("Applicationn not found");
  }
  console.log('find application success');

  
  return {
    appId,
    repoId,
    accessToken,
    userId,
    owner: _.get(applicationResult, '[0].owner', ''),
    trigger_spec: _.get(applicationResult, '[0].trigger_spec', {}),
    secrets: _.assign(
    _.get(userConfig, 'secrets', {}),
    _.get(applicationResult, '[0].secrets', {}))
  };
}

module.exports = {
  getRepoConfig,
}