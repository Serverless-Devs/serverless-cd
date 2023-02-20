const router = require('express').Router();
const _ = require('lodash');
const debug = require('debug')('serverless-cd:org');

const { Result, generateOrgIdByUserIdAndOrgName } = require('../../util');
const { OWNER_ROLE_KEYS, ADMIN_ROLE_KEYS, ROLE } = require('@serverless-cd/config');
const auth = require('../../middleware/auth');
const orgService = require('../../services/org.service');

// 查看团队信息
router.get('/detail', async (req, res) => {
  const { userId, query: { orgName } } = req;
  const orgId = generateOrgIdByUserIdAndOrgName(userId, orgName);
  const result = await orgService.getOrgById(orgId);
  res.json(Result.ofSuccess(orgService.desensitization(result)));
});

// 显示团队成员: TODO 用户名称
router.get('/listUsers', auth(Object.values(ROLE)), async (req, res) => {
  const { query: { orgName } } = req;
  const result = await orgService.listByOrgName(orgName);
  res.json(Result.ofSuccess(orgService.desensitization(result)));
});

// 加入/邀请团队
// TODO: 受邀人员需要同意才能加入，可以通过生成的链接直接加入
router.post('/invite', auth(ADMIN_ROLE_KEYS), async (req, res) => {
  const { orgName, body: { inviteUserId, role } } = req;
  const result = await orgService.invite(orgName, inviteUserId, role);
  res.json(Result.ofSuccess(result));
});

// 编辑个人在团队权限
router.post('/userAuth', auth(ADMIN_ROLE_KEYS), async (req, res) => {
  const { orgName, body: { inviteUserName, role } } = req;
  await orgService.updateUserRole(orgName, inviteUserName, role);
  res.json(Result.ofSuccess());
});

// TODO: 编辑密钥信息【是不是需要修改 owner 的密钥】

// 删除成员
router.post('/removeUser', auth(OWNER_ROLE_KEYS), async (req, res) => {
  const { orgName, body: { inviteUserId } } = req;
  await orgService.deleteUser(orgName, inviteUserId);
  res.json(Result.ofSuccess());
});

// 删除团队
router.post('/remove', auth(OWNER_ROLE_KEYS), async (req, res) => {
  const { orgName, orgId } = req;
  await orgService.remove(orgId, orgName);
  res.json(Result.ofSuccess());
});

// 转让【owner】
router.post('/transfer', auth(OWNER_ROLE_KEYS), async (req, res) => {
  const { orgId, orgName, body: { transferUserName } } = req;
  await orgService.transfer(orgId, orgName, transferUserName);
  res.json(Result.ofSuccess());
});

/**
 * 创建团队
 */
router.post('/create', async (req, res) => {
  const { userId, payload: { name, description } } = req;
  await orgService.createOrg(userId, name, description);
  res.json(Result.ofSuccess());
});

module.exports = router;
