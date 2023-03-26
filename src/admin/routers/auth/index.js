const router = require('express').Router();
const { Result } = require('../../util');
const authServices = require('../../services/auth.service');
const userServices = require('../../services/user.service');

/**
 * 注册
 */
router.post('/signUp', async function (req, res) {
  const { username, password, email, github_unionid, gitee_unionid } = req.body;
  const { userId } = await authServices.initUser({ username, password, email, github_unionid, gitee_unionid });
  const { expires } = await authServices.setJwt({ userId }, res);
  return res.json(Result.ofSuccess({ username, userId, expires }));
});

/**
 * 登录
 */
router.post('/login', async function (req, res) {
  const { loginname, password, github_unionid, gitee_unionid } = req.body;
  const data = await authServices.loginWithPassword({ loginname, password, github_unionid, gitee_unionid });
  const { expires } = await authServices.setJwt({ userId: data.id }, res);
  data.expires = expires;
  return res.json(Result.ofSuccess(userServices.desensitization(data)));
});

/**
 * 退出
 */
router.post('/logout', async function (req, res) {
  req.userId = null;
  res.cookie('jwt', '', { httpOnly: true });
  return res.json(Result.ofSuccess());
});


/**
 * github登录
 */

router.post('/callback/github', async function (req, res) {
  const { code } = req.body;
  const data = await authServices.loginGithub({ code });
  return res.json(Result.ofSuccess(data));
});

/**
 * gitee登录
 */

router.post('/callback/gitee', async function (req, res) {
  const { code } = req.body;
  const data = await authServices.loginGitee({ code });
  return res.json(Result.ofSuccess(data));
});

/**
 * account授权
 */

router.post('/callback/auth', async function (req, res) {
  const { loginname, password, github_unionid, gitee_unionid } = req.body;
  const data = await authServices.updateUser({ loginname, password, github_unionid, gitee_unionid });
  return res.json(Result.ofSuccess(data));
});

/**
 * 更新数据库
 */

router.post('/updata', async function (req, res) {
  const { username: loginname, password, new_password } = req.body;
  const data = await authServices.updateUser({ loginname, password, new_password });
  return res.json(Result.ofSuccess(data));
});


module.exports = router;
