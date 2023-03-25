const router = require('express').Router();
const _ = require('lodash');
const debug = require('debug')('serverless-cd:application');
const { push } = require('@serverless-cd/git');
const { Result, ValidationError } = require('../../util');
const auth = require('../../middleware/auth');
const appService = require('../../services/application.service');
const commonService = require('../../services/common.service');
const { ADMIN_ROLE_KEYS, MEMBER_ROLE_KEYS, ROLE_KEYS } = require('@serverless-cd/config');

/**
 * 创建应用预检测
 */
router.post('/preview', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  await appService.preview(req.body);
  return res.json(Result.ofSuccess());
});

/**
 * 转让【owner】
 */
router.post('/transfer', auth(ADMIN_ROLE_KEYS), async (req, res) => {
  const { transferOrgName, appId } = req.body;
  const result = await appService.transfer(appId, transferOrgName);
  res.json(Result.ofSuccess(result));
});

/**
 * 应用列表
 */
router.get('/list', auth(ROLE_KEYS), async function (req, res) {
  const { orgName } = req;
  const appList = await commonService.listByOrgName(orgName);
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
  const { orgId, orgName } = req;
  const appInfo = await appService.create(orgId, orgName, req.body);
  return res.json(Result.ofSuccess(appInfo));
});

/**
 * 创建通过模版创建应用
 * /createByTemplate?type=initTemplate # 初始化模版
 *  - template: devsapp/start-express
 *  - parameters: {}
 *  - appName: start-express
 * /createByTemplate?type=initRepo # 初始化仓库
 *  - appId
 *  - webHookSecret
 *  - provider
 *  - owner
 *  - repo
 * /createByTemplate?type=initCommit # 初始化commit 信息
 *  - appId
 *  - provider
 *  - owner
 *  - repo
 * /createByTemplate?type=push # 提交代码
 *  - appId
 */
router.post('/createByTemplate', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const { userId, orgId, orgName } = req;
  const { type, provider, appId, owner, repo, template, content } = req.body.params;
  const result = await appService.createByTemplate(
    { type, userId, orgId, orgName },
    { provider, appId, owner, repo, template, content },
  );
  return res.json(Result.ofSuccess(result));
});

/**
 * 应用删除
 */
router.delete('/delete', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  await appService.remove(req.orgName, req.query.appId);

  res.json(Result.ofSuccess({ message: '删除应用成功' }));
});

/**
 * 修改应用
 */
router.post('/update', auth(MEMBER_ROLE_KEYS), async function (req, res) {
  const { appId, environment } = req.body;
  await appService.update(appId, { environment });
  res.json(Result.ofSuccess());
});

/**
 * 删除环境
 */
router.post('/removeEnv', auth(MEMBER_ROLE_KEYS), async function (req, res) {
  const { appId, envName } = req.body;
  if (envName === 'default') {
    throw new ValidationError('默认环境不允许删除');
  }
  if (!(appId || envName)) {
    throw new ValidationError(`appId 和 envName 必填。appId: ${appId}, envName: ${envName}`);
  }
  await appService.removeEnv(appId, envName);
  res.json(Result.ofSuccess());
});

module.exports = router;
