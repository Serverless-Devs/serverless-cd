const router = require('express').Router();
const _ = require('lodash');
const debug = require('debug')('serverless-cd:dispatch');
const { ADMIN_ROLE_KEYS } = require('@serverless-cd/config');

const { Result } = require('../../util');
const auth = require('../../middleware/auth');
const dispatchService = require('../../services/dispatch.service');

//  重新 / 回滚
//  body: { taskId, appId }
router.post('/redeploy', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const { userId, body } = req;
  const result = await dispatchService.redeploy(userId, body);
  res.json(Result.ofSuccess(result));
});


// 取消部署
router.post('/cancel', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  await dispatchService.cancelTask(req.body);
  res.json(Result.ofSuccess());
});

// 手动部署
router.post('/manual', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const { userId, orgId } = req;
  debug(`dispatch manual req.body ${JSON.stringify(req.body)}`);
  const result = await dispatchService.manualTask(userId, orgId, req.body);
  res.json(Result.ofSuccess(result));
});

module.exports = router;