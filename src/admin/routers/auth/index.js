const router = require('express').Router();
const { Result } = require('../../util');
const authServices = require('../../services/auth.service');

/**
 * 注册
 */
router.post('/signUp', async function (req, res) {
  const { username, password } = req.body;
  const { userId, orgId } = await authServices.initUser({ username, password });
  await authServices.setJwt({ userId, orgId }, res);
  return res.json(Result.ofSuccess());
});

/**
 * 登录
 */
router.post('/login', async function (req, res) {
  const { username, password } = req.body;
  const { userId, orgId } = await authServices.loginWithPassword({ username, password });
  await authServices.setJwt({ userId, orgId }, res);
  return res.json(Result.ofSuccess());
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
