const _ = require('lodash');
const { getRepoConfig } = require('./repo');
const constants = require('../constants');

module.exports = async function(triggerInputs, userId) {
  console.log('generate worker inputs start');
  const { url, id: repoId } = _.get(triggerInputs, 'body.repository', {});
  if (_.isEmpty(url) || !_.isNumber(repoId)) {
    throw new Error('Repo url is empty');
  }
  const event = _.get(triggerInputs, 'headers[x-github-event]');
  console.log(`repo is ${event}, repoId is ${repoId}, event is ${event}`);
  if (_.isEmpty(event)) {
    throw new Error("No 'x-github-event' found on request");
  }

  // git 相关参数
  const result = {
    cloneUrl: url,
    provider: constants.PROVIDER_GITHUB,
    event_name: event,
    pusher: _.get(triggerInputs, 'body.pusher'),
  };
  const ref = _.get(triggerInputs, 'body.ref', '');
  const message = _.get(triggerInputs, 'body.head_commit.message', '');
  const commit = _.get(triggerInputs, 'body.after', '');
  if (event === 'push' || event === 'release') {
    _.assign(result, {
      ref,
      commit,
      message,
    });
  }

  // 验证 user，已经组装ots配置信息
  const authorization = await getRepoConfig(constants.PROVIDER_GITHUB, repoId.toString(), userId);
  _.assign(result, { authorization });

  console.log('generate worker inputs success');
  return result;
};
