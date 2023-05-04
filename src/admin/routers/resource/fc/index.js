const router = require('express').Router();
const { Result } = require('../../../util');
const auth = require('../../../middleware/auth/role');
const { MEMBER_ROLE_KEYS } = require('@serverless-cd/config');
const fcService = require('../../../services/fc.service');

router.post('/status', async function (req, res) {
  const { orgName, body } = req;
  const result = await fcService.detail(orgName, body.cloudAlias, body.resource);
  return res.json(Result.ofSuccess(result));
});

router.post('/eventInvoke', auth(MEMBER_ROLE_KEYS), async function (req, res) {
  const { orgName, body } = req;
  const result = await fcService.eventInvoke(orgName, body.cloudAlias, body.resource, body.payload);
  return res.json(Result.ofSuccess(result));
});

router.post('/httpInvoke', auth(MEMBER_ROLE_KEYS), async function (req, res) {
  const { orgName, body } = req;
  const result = await fcService.httpInvoke(orgName, body.cloudAlias, body.resource, body.payload);
  return res.json(Result.ofSuccess(result));
});

module.exports = router;
