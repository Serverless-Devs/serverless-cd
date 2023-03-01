const router = require('express').Router();
const { Result } = require('../../util');
const authServices = require('../../services/auth.service');
const userServices = require('../../services/user.service');

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
  const { username, password, email } = req.body;
  const data = await authServices.loginWithPassword({ username, password, email });
  await authServices.setJwt({ userId: data.id }, res);
  console.log('123123123', data);
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
