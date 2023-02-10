const router = require('express').Router();
const _ = require('lodash');
const debug = require('debug')('serverless-cd:deploy');
const { ADMIN_ROLE_KEYS } = require('@serverless-cd/config');

const { Result } = require('../../util');
const auth = require('../../middleware/auth');
const dispatchService = require('../../services/dispatch.service');

//  重新 / 回滚
router.post('/redeploy', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const { userId, body } = req;
  const result = await dispatchService.redeploy(body, userId);
  res.json(Result.ofSuccess(result));
});


// 取消部署
router.post('/cancel', async function (req, res) {
  await dispatchService.cancelTask(req.body);
  res.json(Result.ofSuccess());
});

module.exports = router;