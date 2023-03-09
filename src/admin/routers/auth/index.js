const router = require('express').Router();
const { Result } = require('../../util');
const authServices = require('../../services/auth.service');

/**
 * 注册
 */
router.post('/signUp', async function (req, res) {
  const { username, password, email } = req.body;
  const { userId } = await authServices.initUser({ username, password, email });
  await authServices.setJwt({ userId }, res);
  return res.json(Result.ofSuccess({ username, userId }));
});

/**
 * 登录
 */
router.post('/login', async function (req, res) {
  const { loginname, password } = req.body;
  const data = await authServices.loginWithPassword({ loginname, password });
  await authServices.setJwt({ userId: data.id }, res);
  return res.json(Result.ofSuccess(data));
});

/**
 * 退出
 */
router.post('/logout', async function (req, res) {
  req.userId = null;
  res.cookie('jwt', '', { httpOnly: true });
  return res.json(Result.ofSuccess());
});

module.exports = router;
