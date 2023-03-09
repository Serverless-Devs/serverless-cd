const router = require('express').Router();
const { Result, NeedLogin } = require('../../util');
const userService = require('../../services/user.service');
const orgService = require('../../services/org.service');

/**
 * 用户信息
 */
router.get('/info', async function (req, res) {
  const { userId } = req;
  const result = await userService.getUserById(userId);
  if (!result.id) {
    throw new NeedLogin('用户信息异常');
  }

  const listOrgs = await orgService.listByUserId(userId);
  const userInfo = {
    ...userService.desensitization(result),
    listOrgs: orgService.desensitization(listOrgs),
  };

  return res.json(Result.ofSuccess(userInfo));
});

/**
 * 通过名称模糊查询
 */
router.get('/containsName', async function (req, res) {
  const { containsName } = req.query;
  const result = await userService.fuzzyQueriesByName(containsName);
  return res.json(Result.ofSuccess(result));
});

/**
 * 显示个人所有的团队
 */
router.get('/listOrgs', async (req, res) => {
  const { userId } = req;
  const result = await orgService.listByUserId(userId);
  res.json(Result.ofSuccess(orgService.desensitization(result)));
});

module.exports = router;
