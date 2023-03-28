const router = require('express').Router();
const _ = require('lodash');
const debug = require('debug')('serverless-cd:org');

const { Result, generateOrgIdByUserIdAndOrgName } = require('../../util');
const { OWNER_ROLE_KEYS, ADMIN_ROLE_KEYS, ROLE_KEYS } = require('@serverless-cd/config');
const auth = require('../../middleware/auth');
const orgService = require('../../services/org.service');

// 查看团队信息
router.get('/detail', auth(ROLE_KEYS), async (req, res) => {
  const {
    userId,
    query: { orgName },
  } = req;
  const orgId = generateOrgIdByUserIdAndOrgName(userId, orgName);
  const result = await orgService.getOrgById(orgId);
  res.json(Result.ofSuccess(orgService.desensitization(result)));
});

// 显示团队成员
router.get('/listUsers', auth(ROLE_KEYS), async (req, res) => {
  const { orgId, orgName } = req;
  const result = await orgService.listByOrgName(orgId, orgName);
  res.json(Result.ofSuccess(orgService.desensitization(result)));
});

// 加入/邀请团队
// TODO: 受邀人员需要同意才能加入，可以通过生成的链接直接加入
router.post('/invite', auth(ADMIN_ROLE_KEYS), async (req, res) => {
  const {
    orgName,
    body: { inviteUserName, role },
  } = req;
  await orgService.invite(orgName, inviteUserName, role);
  res.json(Result.ofSuccess());
});

// 编辑个人在团队权限
router.post('/updateAuth', auth(ADMIN_ROLE_KEYS), async (req, res) => {
  const {
    orgName,
    body: { inviteUserName, role },
  } = req;
  await orgService.updateUserRole(orgName, inviteUserName, role);
  res.json(Result.ofSuccess());
});

// 编辑信息
router.post('/update', auth(ADMIN_ROLE_KEYS), async (req, res) => {
  const {
    orgName,
    body: { secrets },
  } = req;
  await orgService.updateOwnerByName(orgName, { secrets });
  res.json(Result.ofSuccess());
});

/**
 * 绑定 github token
 */
router.put('/token', auth(OWNER_ROLE_KEYS), async function (req, res) {
  const { orgName } = req;
  const { token, provider } = _.get(req, 'body.data', {});
  await orgService.updateThirdPart(orgName, { token, provider });
  return res.json(Result.ofSuccess());
});

// 删除成员
router.post('/removeUser', auth(ADMIN_ROLE_KEYS), async (req, res) => {
  const {
    orgName,
    body: { inviteUserId },
  } = req;
  await orgService.deleteUser(orgName, inviteUserId);
  res.json(Result.ofSuccess());
});

// 删除团队
router.post('/remove', auth(OWNER_ROLE_KEYS), async (req, res) => {
  const { orgName, orgId } = req;
  await orgService.remove(orgId, orgName);
  res.json(Result.ofSuccess());
});

// 仓库拥有者转让
router.post('/transfer', auth(OWNER_ROLE_KEYS), async (req, res) => {
  const {
    orgId,
    orgName,
    body: { transferUserName },
  } = req;
  await orgService.transfer(orgId, orgName, transferUserName);
  res.json(Result.ofSuccess());
});

/**
 * 创建团队
 */
router.post('/create', async (req, res) => {
  const {
    userId,
    body, // { name: '', secrets?: {}, logo?: '', description?: '', alias?: ''}
  } = req;
  await orgService.createOrg(userId, body);
  res.json(Result.ofSuccess());
});

module.exports = router;
