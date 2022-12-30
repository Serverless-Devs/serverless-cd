const router = require("express").Router();
const { lodash: _ } = require("@serverless-cd/core");
const model = require('./model');
const { Result, unionToken, unionid, ValidationError } = require('../../util');

const getTokenInfo = async (id) => {
  const result = await model.findOne(id);

  console.log(`token info : ${JSON.stringify(result)}`);

  if (_.isEmpty(result)) {
    throw new ValidationError('当前token 不存在');
  }

  return Result.ofSuccess(result)
}


router.get("/list", async function (req, res) {

  console.log(`token list userId: ${req.userId}`);

  const tokenList = await model.find({ user_id: req.userId });
  const result = _.get(tokenList, 'result', []).map((tokenItem) => _.omit(tokenItem, 'cd_token'))
  console.log('token list result', result);
  res.json(Result.ofSuccess({
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

  res.json(Result.ofSuccess({ cd_token }));
});

router.post("/delete", async function (req, res) {
  const { id } = req.body;

  console.log(`delete token body: ${JSON.stringify(req.body)}`);

  const { success, data: result, message } = await getTokenInfo(id);
  if (!success) {
    throw new Error(message);
  }

  await model.remove(result.id);

  res.json(Result.ofSuccess());
});

router.post("/update", async function (req, res) {
  const { id, expiration } = req.body;

  console.log(`update token body: ${JSON.stringify(req.body)}`);

  const { success, data: result, message } = await getTokenInfo(id);
  if (!success){
    throw new Error(message);
  }
  console.log('update tokenInfo', result)
  await model.update(result.id, {
    expire_time: expiration === -1 ? expiration : Date.now() + expiration,
  });

  res.json(Result.ofSuccess());
});

module.exports = router;
