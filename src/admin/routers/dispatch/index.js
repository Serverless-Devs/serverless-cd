const router = require('express').Router();
const debug = require('debug')('serverless-cd:dispatch');
const { MEMBER_ROLE_KEYS } = require('@serverless-cd/config');

const { Result } = require('../../util');
const auth = require('../../middleware/auth/role');
const dispatchService = require('../../services/dispatch.service');

//  重新 / 回滚
//  body: { taskId, appId }
router.post('/redeploy', auth(MEMBER_ROLE_KEYS), async function (req, res) {
  const { orgId, orgName, body } = req;
  const result = await dispatchService.redeploy(orgId, orgName, body);
  res.json(Result.ofSuccess(result));
});

// 取消部署
router.post('/cancel', auth(MEMBER_ROLE_KEYS), async function (req, res) {
  await dispatchService.cancelTask(req.body);
  res.json(Result.ofSuccess());
});

// 手动部署
router.post('/manual', auth(MEMBER_ROLE_KEYS), async function (req, res) {
  const { orgId, orgName } = req;
  debug(`dispatch manual req.body ${JSON.stringify(req.body)}`);
  const result = await dispatchService.manualTask(orgId, orgName, req.body);
  res.json(Result.ofSuccess(result));
});

module.exports = router;
