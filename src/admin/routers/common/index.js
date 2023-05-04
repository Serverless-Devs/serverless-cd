const router = require('express').Router();
const { Result, Webhook } = require('../../util');
const auth = require('../../middleware/auth/role');
const { MEMBER_ROLE_KEYS } = require('@serverless-cd/config');
const init = require('../../services/init.service');
const webhook = require('../../services/webhook.service');
const { tracker } = require('../../services/tracker.service');

router.get('/init', async function (req, res) {
  const { prisma = 'sqlite' } = req.query;
  await init(prisma);
  return res.json(Result.ofSuccess());
});

router.post(`/${Webhook.ROUTE}`, async function (req, res) {
  const {
    headers,
    body,
    query: { app_id: appId },
  } = req;
  if (!appId) {
    throw new ValidationError('Not a standard Serverless-cd trigger, lacks app_id');
  }

  const taskId = await webhook.triggered(appId, headers, body);
  res.json(
    Result.ofSuccess({
      taskId,
      success: true,
      message: 'OK',
    }),
  );
});

router.post('/tracker', auth(MEMBER_ROLE_KEYS), async function (req, res) {
  const result = await tracker(req.orgName, req.body);
  return res.json(Result.ofSuccess(result));
});

module.exports = router;
