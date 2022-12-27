const router = require("express").Router();
const _ = require("lodash");
const { OTS_USER } = require('../config');
const { generateSuccessResult, generateErrorResult } = require('../util');
const orm = require("../util/orm")(OTS_USER.name, OTS_USER.index);

router.post("/loginout", async function (req, res, next) {
  req.user.userId = null;
  res.cookie('jwt', '', { httpOnly: true });
  return res.json(generateSuccessResult());
});

router.post("/userInfo", async function (req, res, next) {
  const data = await orm.find({ id: req.user.userId });
  const result = _.get(data, 'result[0]', {});

  console.log('获取用户信息', result)

  const params = !(_.isEmpty(result)) ? {
    ...(_.omit(result, ['third_part', 'password', 'secrets'])),
    isAuth: !!(_.get(result, 'third_part.github.access_token', false)),
    github_name: _.get(result, 'third_part.github.owner', '')
  } : {}

  return res.json(generateSuccessResult(params));
});

router.post("/updateUserProviderToken", async function (req, res, next) {
  const data = await orm.findByPrimary([{ id: req.user.userId }]);
  console.log('data:: ', data);
  const third_part = _.get(data, "third_part", {});
  const github = _.get(third_part, "github", {});
  const body = _.get(req.body, 'data', {});
  await orm.update([{ id: data.id }], {
    third_part: {
      ...third_part,
      github: {
        ...github,
        access_token: body.token,
      },
    }
  });

  return res.json(generateSuccessResult());
});

router.post('/addOrCompileSecrets', async function (req, res) {
  console.log('secrets body', req.body);
  const { data: { secrets, isAdd } } = req.body;
  const { secrets: currentSecrets = {} } = await orm.findOne({ id: req.user.userId });
  await orm.update([{ id: req.user.userId }], {
    secrets: isAdd ? _.assign(currentSecrets, secrets) : secrets
  });
  return res.json(generateSuccessResult());
})

router.get('/globalSecrets', async function (req, res, next) {
  const result = await orm.findOne({ id: req.user.userId });
  console.log('获取用户信息', result)

  if (_.isEmpty(result)) {
    return res.json(generateErrorResult('当前用户信息不存在'))
  }

  const params = { secrets: _.get(result, 'secrets', {}) }

  return res.json(generateSuccessResult(params));
})

module.exports = router;
