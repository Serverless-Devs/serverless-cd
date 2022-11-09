const _ = require('lodash');
const constants = require('./constants');

const getTriggerEvent = (payload) => {
  const triggerType = _.get(payload, 'triggerType');

  // TODO：手动触发 / 定时触发
  if (triggerType === 'manual_dispatch' || triggerType === 'schedule') {
    throw new Error('TODO');
  }
  // 如果 triggerType 存在，但是不为 manual_dispatch 或者 schedule，则为异常
  if (!_.isEmpty(triggerType)) {
    throw new Error(`Not support triggerType: ${triggerType}`);
  }

  const ua = _.get(payload, 'headers[user-agent]', '');
  if (_.startsWith(ua, 'GitHub-Hookshot')) {
    return constants.PROVIDER_GITHUB;
  }

  throw new Error('Unrecognized trigger type');
};

module.exports = getTriggerEvent;
