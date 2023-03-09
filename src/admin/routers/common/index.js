const router = require('express').Router();
const { Result, Webhook } = require('../../util');
const init = require('../../services/init.service');
const webhook = require('../../services/webhook.service');

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

module.exports = router;
