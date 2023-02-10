const router = require('express').Router();
const _ = require('lodash');
const { Result, NoPermissionError } = require('../../util');
const { OWNER_ROLE_KEYS } = require('@serverless-cd/config');
const auth = require('../../middleware/auth');
const userService = require('../../services/user.service');

/**
 * 用户信息
 */
router.get('/info', async function (req, res) {
  const { userId } = req;
  const result = await userService.getUserById(userId);
  if (!result.id) {
    throw new NoPermissionError('用户信息异常');
  }

  const third_part = _.get(result, 'third_part', {});
  const userInfo = {
    ..._.omit(result, ['third_part', 'password', 'secrets']),
    isAuth: !!_.get(third_part, 'github.access_token', false),
    github_name: _.get(third_part, 'github.owner', ''),
  };

  return res.json(Result.ofSuccess(userInfo));
});

/**
 * 绑定 github token
 */
router.put('/token', auth(OWNER_ROLE_KEYS), async function (req, res) {
  const { userId } = req;
  const data = await userService.getUserById(userId);
  const access_token = _.get(req, 'body.data.token', '');
  const provider = _.get(req, 'body.data.provider', '');
  _.set(data, `third_part.${provider}.access_token`, access_token);

  await userService.updateUserById(userId, data);
  return res.json(Result.ofSuccess());
});

module.exports = router;
