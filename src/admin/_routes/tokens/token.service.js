const { lodash: _ } = require('@serverless-cd/core');
const { ValidationError, Result } = require('../../util');
const model = require('./model');

async function queryToken(cd_token) {
  const tokenInfo = await model.find({ cd_token });
  const result = _.get(tokenInfo, 'result[0]', {});
  if (_.isEmpty(result)) {
    throw new ValidationError('token 不存在');
  }
  return Result.ofSuccess(result);
}

async function updateActiveToken(id) {
  await model.update(id, {
    active_time: Date.now(),
  });

  return Result.ofSuccess();
}

module.exports = {
  queryToken,
  updateActiveToken,
};
