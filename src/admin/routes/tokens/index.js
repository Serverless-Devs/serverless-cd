const router = require("express").Router();
const { lodash: _ } = require("@serverless-cd/core");
const model = require('./model');
const { generateSuccessResult, unionToken, unionid, generateErrorResult } = require('../../util');

const getTokenInfo = async (id) => {
  const result = await model.findOne(id);

  console.log(`token info : ${JSON.stringify(result)}`);

  if (_.isEmpty(result)) {
    return generateErrorResult('当前token 不存在')
  }

  return generateSuccessResult(result)
}


router.get("/list", async function (req, res) {

  console.log(`token list userId: ${req.userId}`);

  const tokenList = await model.find({ user_id: req.userId });
  const result = _.get(tokenList, 'result', []).map((tokenItem) => _.omit(tokenItem, 'cd_token'))
  console.log('token list result', result);
  res.json(generateSuccessResult({
    result
  }));
});

router.post("/create", async function (req, res) {
  const { description, expiration } = req.body;
  const cd_token = unionToken();
  const id = unionid();

  console.log(`create token: ${cd_token}, body: ${JSON.stringify(req.body)}`);
  const params = {
    description,
    expire_time: expiration === -1 ? expiration : Date.now() + expiration,
    user_id: req.userId,
    cd_token
  }

  await model.create(id, params);

  res.json(generateSuccessResult({ cd_token }));
});

router.post("/delete", async function (req, res) {
  const { id } = req.body;

  console.log(`delete token body: ${JSON.stringify(req.body)}`);

  const { success, data: result, message } = await getTokenInfo(id);
  if (!success) return res.json(generateErrorResult(message));

  await model.remove(result.id);

  res.json(generateSuccessResult());
});

router.post("/update", async function (req, res) {
  const { id, expiration } = req.body;

  console.log(`update token body: ${JSON.stringify(req.body)}`);

  const { success, data: result, message } = await getTokenInfo(id);
  if (!success) return res.json(generateErrorResult(message));
  console.log('update tokenInfo', result)
  await model.update(result.id, {
    expire_time: expiration === -1 ? expiration : Date.now() + expiration,
  });

  res.json(generateSuccessResult());
});

module.exports = router;
