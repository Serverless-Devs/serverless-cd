const router = require("express").Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { OTS_USER, SUPPORT_LOGIN, COOKIE_SECRET, SESSION_EXPIRATION } = require('../../config');
const { unionid, md5Encrypt, generateSuccessResult, generateErrorResult } = require("../../util");
const userOrm = require("../../util/orm")(OTS_USER.name, OTS_USER.index);

const SESSION_EXPIRATION_EXP = Math.floor(Date.now() / 1000) + Math.floor(SESSION_EXPIRATION / 1000);

router.post("/signUp", async function (req, res) {
  console.log("账号注册 req.body", JSON.stringify(req.body));
  const { username, password } = req.body;
  const userResult = await userOrm.find({ username: username });
  const data = _.get(userResult, "result[0]", {});
  if (_.get(data, 'username', '')) {
    return res.json(generateErrorResult('用户名已存在'));
  }
  const id = unionid();
  await userOrm.create(
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
  req.userId = userId.id;
  const token = await jwt.sign({ userId: id, exp: SESSION_EXPIRATION_EXP }, COOKIE_SECRET);
  res.cookie('jwt', token, { maxAge: SESSION_EXPIRATION, httpOnly: true });
  return res.json(generateSuccessResult());
})

router.post("/login", async function (req, res) {
  console.log("账号登陆 req.query", JSON.stringify(req.body));
  const { username, password } = req.body;
  const userResult = await userOrm.find({ username: username });
  const data = _.get(userResult, "result[0]", {});
  if (_.get(data, 'username', '')) {
    if (_.get(data, 'password', '') === md5Encrypt(password)) {
      req.userId = data.id;
      const token = await jwt.sign({ userId: data.id, exp: SESSION_EXPIRATION_EXP }, COOKIE_SECRET);
      res.cookie('jwt', token, { maxAge: SESSION_EXPIRATION, httpOnly: true });
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