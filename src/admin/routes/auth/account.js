const router = require("express").Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { OTS_USER, SUPPORT_LOGIN, COOKIE_SECRET } = require('../../config');
const { unionid, setReqConfig, md5Encrypt, generateSuccessResult, generateErrorResult } = require("../../util");
const orm = require("../../util/orm")(OTS_USER.name, OTS_USER.index);

router.post("/signUp", async function (req, res) {
  console.log("账号注册 req.body", JSON.stringify(req.body));
  const { username, password } = req.body;
  const userResult = await orm.find({ username: username });
  const data = _.get(userResult, "result[0]", {});
  if (_.get(data, 'username', '')) {
    return res.json(generateErrorResult('用户名已存在'));
  }
  const id = unionid();
  await orm.create(
    [
      {
        id,
      },
    ],
    {
      username: username,
      password: md5Encrypt(password),
    }
  );
  setReqConfig(req, { userId: id });
  const token = jwt.sign({ userId: data.id }, COOKIE_SECRET);
  res.cookie('jwt', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
  return res.json(generateSuccessResult());
})

router.post("/login", async function (req, res) {
  console.log("账号登陆 req.query", JSON.stringify(req.body));
  const { username, password } = req.body;
  const userResult = await orm.find({ username: username });
  const data = _.get(userResult, "result[0]", {});
  if (_.get(data, 'username', '')) {
    if (_.get(data, 'password', '') === md5Encrypt(password)) {
      setReqConfig(req, { userId: data.id });

      const token = jwt.sign({ userId: data.id }, COOKIE_SECRET);
      res.cookie('jwt', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(generateSuccessResult());
    }
    return res.json(generateErrorResult('密码不正确'));
  }
  return res.json(generateErrorResult('用户名不存在'))
})

router.get("/supportLoginTypes", (_req, res) => {
  res.json(generateSuccessResult(SUPPORT_LOGIN))
})

module.exports = router;