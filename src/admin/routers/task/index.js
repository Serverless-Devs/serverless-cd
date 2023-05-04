const router = require('express').Router();
const _ = require('lodash');
const debug = require('debug')('serverless-cd:task');

const { Result, ValidationError } = require('../../util');
const auth = require('../../middleware/auth/role');
const { MEMBER_ROLE_KEYS } = require('@serverless-cd/config');
const taskService = require('../../services/task.service');
const { retryOnce } = require('../../services/dispatch.service');

/**
 * task 列表
 * query: { appId, envName?, taskId?, pageSize, currentPage }
 */
router.get('/list', async function (req, res) {
  const { totalCount, result } = await taskService.list(req.query);
  return res.json(
    Result.ofSuccess({
      result: _.map(result, taskService.getTaskConfig),
      totalCount,
    }),
  );
});

/**
 * task 详情
 */
router.get('/detail', async function (req, res) {
  const result = await taskService.detail(req.query.id);
  return res.json(Result.ofSuccess(taskService.getTaskConfig(result)));
});

/**
 * task 日志
 */
router.get('/log', async function (req, res) {
  const taskId = _.get(req.query, 'id');
  const stepCount = _.get(req.query, 'stepCount');
  if (_.isEmpty(taskId)) {
    throw new ValidationError('Taski id is empty');
  }
  if (_.isEmpty(stepCount)) {
    throw new ValidationError('StepCount is empty');
  }

  const { data } = await retryOnce(JSON.stringify({ taskId, stepCount }));
  debug(`Get retry count: ${data}`);
  const { msg } = JSON.parse(data);

  res.json(Result.ofSuccess(msg));
});

/**
 * 删除 task
 */
router.post('/remove', auth(MEMBER_ROLE_KEYS), async function (req, res) {
  const taskId = _.get(req.body, 'id');
  await taskService.remove(taskId);
  res.json(Result.ofSuccess());
});

/**
 * 
 */
router.post('/exists', auth(MEMBER_ROLE_KEYS), async function (req, res) {
  const taskId = _.get(req.body, 'id');
  const payload = _.get(req.body, 'payload', {});
  await taskService.exists(taskId, payload);
  res.json(Result.ofSuccess());
});

module.exports = router;
