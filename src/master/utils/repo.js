const _ = require('lodash');
const findUser = require('../model/user').findOne;
const findApplication = require('../model/application').find;

async function getRepoConfig(provider, appId) {
  console.log('find application');
  const application = await findApplication({ provider, id: appId });
  const applicationResult = _.get(application, 'result', []);
  if (applicationResult.length !== 1) {
    throw new Error(`Get ${applicationResult.length} applications, one is expected`);
  }

  const userId = _.get(applicationResult, '[0].user_id', null);
  const repoId = _.get(applicationResult, '[0].provider_repo_id', null);
  const app_id = _.get(applicationResult, '[0].id');
  if (_.isEmpty(app_id, null)) {
    throw new Error('Applicationn not found');
  }
  console.log('find application success');

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

  return {
    appId,
    repoId,
    accessToken,
    userId,
    owner: _.get(applicationResult, '[0].owner', ''),
    secrets: _.assign(
      _.get(userConfig, 'secrets', {}),
      _.get(applicationResult, '[0].secrets', {}),
    ),
    environment: _.get(applicationResult, '[0].environment', {}),
    webhook_secret: _.get(applicationResult, '[0].webhook_secret', ''),
  };
}

module.exports = {
  getRepoConfig,
};
