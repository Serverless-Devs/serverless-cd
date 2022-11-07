
const { lodash: _ }  = require("@serverless-cd/core");
const { generateErrorResult, generateSuccessResult } = require("../../../util");
const model = require('../model');

async function queryToken(cd_token) {

  const tokenInfo = await model.find({cd_token});
  const result = _.get(tokenInfo, 'result[0]', {});
  console.log('tokens find', result)
  if (_.isEmpty(result)) {
    return generateErrorResult('token 不存在')
  }
  return generateSuccessResult(result)
}

async function updateToken(id) {

  await model.update(id, {
    active_time: Date.now()
  });

  return generateSuccessResult()
}

module.exports = {
  queryToken,
  updateToken
}
