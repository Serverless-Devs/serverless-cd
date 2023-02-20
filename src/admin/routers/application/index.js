const router = require('express').Router();
const _ = require('lodash');
const debug = require('debug')('serverless-cd:application');

const { Result, ValidationError } = require('../../util');
const auth = require('../../middleware/auth');
const appService = require('../../services/application.service');
const userService = require('../../services/user.service');
const { ADMIN_ROLE_KEYS, OWNER_ROLE_KEYS, ROLE_KEYS } = require('@serverless-cd/config');

/**
 * 创建应用预检测
 */
router.post('/preview', async function (req, res) {
  await appService.preview(req.body);
  return res.json(Result.ofSuccess());
});

/**
 * 转让【owner】
 */
router.post('/transfer', auth(OWNER_ROLE_KEYS), async (req, res) => {
  const { transferOrgId, appId } = req.body;
  const result = await appService.update(appId, { org_id: transferOrgId });
  res.json(Result.ofSuccess(result));
});

/**
 * 应用列表
 */
router.get('/list', auth(ROLE_KEYS), async function (req, res) {
  const { orgId } = req;
  const appList = await appService.listByOrgId(orgId);
  return res.json(Result.ofSuccess(appList));
});

/**
 * 应用查询
 */
router.get('/detail', auth(ROLE_KEYS), async function (req, res) {
  const appDetail = await appService.getAppById(req.query.id);
  if (_.isEmpty(appDetail)) {
    throw new ValidationError('暂无应用信息');
  }
  return res.json(Result.ofSuccess(appDetail));
});


/**
 * 创建应用
 */
router.post('/create', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const { userId, orgId } = req;
  const { provider } = req.body;
  const token = await userService.getProviderToken(orgId, userId, provider);

  const appInfo = await appService.create(orgId, token, req.body);
  return res.json(Result.ofSuccess(appInfo));
});

/**
 * 应用删除
 */
router.delete('/delete', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const { userId, orgId } = req;
  await appService.remove(orgId, userId, req.query.appId);

  res.json(Result.ofSuccess({ message: '删除应用成功' }));
});

/**
 * 修改应用
 */
router.post('/update', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const { appId, environment } = req.body;
  await appService.update(appId, { environment });
  res.json(Result.ofSuccess());
});

/**
 * 删除环境
 */
router.post('/removeEnv', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const { appId, envName } = req.body;
  if (!(appId || envName)) {
    throw new ValidationError(`appId 和 envName 必填。appId: ${appId}, envName: ${envName}`);
  }
  await appService.removeEnv(appId, envName);
  res.json(Result.ofSuccess());
});

module.exports = router;
