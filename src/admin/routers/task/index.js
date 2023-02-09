const router = require('express').Router();
const _ = require('lodash');
const debug = require('debug')('serverless-cd:task');

const { Result, NoPermissionError, ValidationError } = require('../../util');
const auth = require('../../middleware/auth');
const { ADMIN_ROLE_KEYS } = require('@serverless-cd/config');
const taskService = require('../../services/task.service');

/**
 * 用户信息
 */
router.get('/list', async function (req, res) {
  const result = await taskService.list(req.query.appId);
  return res.json(Result.ofSuccess({
    result,
    totalCount: result.length,
  }));
});

module.exports = router;