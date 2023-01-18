const router = require('express').Router();
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { COOKIE_SECRET, SESSION_EXPIRATION } = require('../../config/config');
const { md5Encrypt, Result, ValidationError } = require('../../util');
const userModel = require('../../models/account.mode');
const SESSION_EXPIRATION_EXP =
  Math.floor(Date.now() / 1000) + Math.floor(SESSION_EXPIRATION / 1000);

/**
 * 注册
 */
router.post('/signUp', async function (req, res) {
  const { username, password } = req.body;
  const data = await userModel.getUserByName(username);
  if (_.get(data, 'username', '')) {
    throw new ValidationError('用户名已存在');
  }
  const { id } = await userModel.createUser({ username, password });
  req.userId = id;
  const token = await jwt.sign({ userId: id, exp: SESSION_EXPIRATION_EXP }, COOKIE_SECRET);
  res.cookie('jwt', token, { maxAge: SESSION_EXPIRATION, httpOnly: true });
  return res.json(Result.ofSuccess());
});

/**
 * 登录
 */
router.post('/login', async function (req, res) {
  const { username, password } = req.body;
  const data = await userModel.getUserByName(username);
  if (_.get(data, 'password', '') === md5Encrypt(password)) {
    req.userId = data.id;
    const token = await jwt.sign({ userId: data.id, exp: SESSION_EXPIRATION_EXP }, COOKIE_SECRET);
    res.cookie('jwt', token, { maxAge: SESSION_EXPIRATION, httpOnly: true });
    return res.json(Result.ofSuccess());
  }
  throw new ValidationError('用户名或密码不正确');
});

module.exports = router;
