const router = require('express').Router();
const _ = require('lodash');
const debug = require('debug')('serverless-cd:org');

const { Result } = require('../../util');
const { OWNER_ROLE_KEYS, ADMIN_ROLE_KEYS } = require('@serverless-cd/config');
const auth = require('../../middleware/auth');
const orgService = require('../../services/org.service');

// 显示团队成员
router.get('/listUsers', async (req, res) => {
  const { orgId } = req;
  const result = await orgService.listByOrgId(orgId);
  res.json(Result.ofSuccess(result));
});

// 加入/邀请团队
// TODO: 受邀人员需要同意才能加入，可以通过生成的链接直接加入
router.post('/invite', auth(ADMIN_ROLE_KEYS), async (req, res) => {
  const { orgId } = req;
  const result = await orgService.invite(orgId, req.body);
  res.json(Result.ofSuccess(result));
});

// 编辑个人在团队权限
router.post('/userAuth', async (req, res) => {
  const { orgId } = req;
  const result = await orgService.updateUserRole(orgId, req.body);
  res.json(Result.ofSuccess(result));
});

// 删除成员
router.post('/removeUser', auth(OWNER_ROLE_KEYS), async (req, res) => {
  const { orgId } = req;
  const { userId } = req.body;
  const result = await orgService.deleteUser(orgId, userId);
  res.json(Result.ofSuccess(result));
});

// 删除组织
router.post('/remove', auth(OWNER_ROLE_KEYS), async (req, res) => {
  const { orgId } = req;
  const result = await orgService.remove(orgId);
  res.json(Result.ofSuccess(result));
});

// 转让【owner】
router.post('/transfer', auth(OWNER_ROLE_KEYS), async (req, res) => {
  const { orgId } = req;
  const { userId: transferUserId } = req.body;
  const result = await orgService.transfer(orgId, transferUserId);
  res.json(Result.ofSuccess(result));
});

/**
 * 创建团队
 */
router.post('/create', async (req, res) => {
  const { userId } = req;
  await orgService.createOrg(userId, req.body);
  res.json(Result.ofSuccess());
});

module.exports = router;
