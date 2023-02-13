const router = require('express').Router();
const _ = require('lodash');
const fs = require('fs');
const debug = require('debug')('serverless-cd:task');

const { Result, Client, ValidationError } = require('../../util');
const auth = require('../../middleware/auth');
const { ADMIN_ROLE_KEYS } = require('@serverless-cd/config');
const taskService = require('../../services/task.service');

/**
 * task 列表
 */
router.get('/list', async function (req, res) {
  const { totalCount, result } = await taskService.list(req.query);
  return res.json(Result.ofSuccess({
    result: _.map(result, taskService.getTaskConfig),
    totalCount,
  }));
});

/**
 * task 详情
 */
router.get('/detail', async function (req, res) {
  const result = await taskService.detail(req.query.taskId);
  return res.json(Result.ofSuccess(taskService.getTaskConfig(result)));
});

/**
 * task 日志
 */
router.get('/log', async function (req, res) {
  const taskId = _.get(req.query, 'taskId');
  const stepCount = _.get(req.query, 'stepCount');
  if (_.isEmpty(taskId)) {
    throw new ValidationError('TaskId is empty');
  }
  if (_.isEmpty(stepCount)) {
    throw new ValidationError('StepCount is empty');
  }
  const logPath = `/mnt/auto/logs/${taskId}/step_${stepCount}.log`;
  try {
    res.json(Result.ofSuccess(fs.readFileSync(logPath, 'utf8')));
  } catch (ex) {
    if (ex.status === 404) {
      throw new NotFoundError('The logs for this run have expired and are no longer available.');
    }
    console.error(ex.status, ex.code, ex.message);
    throw ex;
  }
});

/**
 * 删除 task
 */
router.post('/remove', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const taskId = _.get(req.body, 'taskId');
  await taskService.remove(taskId);
  res.json(Result.ofSuccess());
});

module.exports = router;