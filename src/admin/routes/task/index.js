const router = require("express").Router();
const { lodash: _ } = require("@serverless-cd/core");
const Client = require("../../util/client");
const model = require('./model');
const { generateSuccessResult, ValidationError, formatBranch } = require('../../util');

const getTaskConfig = (taskConfig) => {
  const result = _.omit(taskConfig, 'trigger_payload');
  result.message = _.get(taskConfig, 'trigger_payload.message');
  result.commit = _.get(taskConfig, 'trigger_payload.commit');
  result.ref = _.get(taskConfig, 'trigger_payload.ref');
  result.repo_name = _.get(taskConfig, 'trigger_payload.authorization.appName');
  result.owner = _.get(taskConfig, 'trigger_payload.authorization.owner');
  result.interceptor = _.get(taskConfig, 'trigger_payload.interceptor');
  result.redelivery = _.get(taskConfig, 'trigger_payload.redelivery');
  result.branch = formatBranch(result.ref);

  return result;
}

router.get("/list", async function (req, res) {
  const userId = req.userId;
  const { appId, currentPage = 1, pageSize = 10 } = req.query;
  if (_.isEmpty(appId)) {
    throw new ValidationError('AppId is empty');
  }
  console.log(`task list userId: ${userId}, query: ${JSON.stringify(req.query)}`);
  const params = {
    user_id: userId,
    app_id: appId,
    orderKeys: ['updated_time', 'created_time'],
    currentPage: Number(currentPage),
    pageSize: Number(pageSize)
  }
  _.filter(params, (value, key) => !value && delete params[key]);
  console.log('task list request params:', params);
  const taskList = await model.find(params);
  console.log('taskList::', taskList);
  return res.json(generateSuccessResult({
    ...taskList,
    result: _.get(taskList, 'result', []).map(getTaskConfig)
  }));
});

router.get("/get", async function (req, res) {
  const userId = req.userId;
  const taskId = _.get(req.query, 'taskId');
  if (_.isEmpty(taskId)) {
    throw new ValidationError('TaskId is empty');
  }
  console.log(`task get userId: ${userId}, query: ${JSON.stringify(req.query)}`);
  const taskConfig = await model.findOne(taskId);
  res.json(generateSuccessResult(getTaskConfig(taskConfig)));
});

router.post("/remove", async function (req, res) {
  const userId = req.userId;
  const taskId = _.get(req.body, 'taskId');
  if (_.isEmpty(taskId)) {
    throw new ValidationError('TaskId is empty');
  }
  console.log(`task delete userId: ${userId}, body: ${JSON.stringify(req.body)}`);
  const removeResult = await model.remove(taskId);
  console.log('task remove response', removeResult);
  res.json(generateSuccessResult());
});


router.get("/log", async (req, res) => {
  const taskId = _.get(req.query, 'taskId');
  const stepCount = _.get(req.query, 'stepCount');
  if (_.isEmpty(taskId)) {
    throw new ValidationError('TaskId is empty');
  }
  if (_.isEmpty(stepCount)) {
    throw new ValidationError('StepCount is empty');
  }
  const ossClient = Client.oss();
  try {
    const { content } = await ossClient.get(`logs/${taskId}/step_${stepCount}.log`);
    res.json(generateSuccessResult(content.toString('utf8')));
  } catch (ex) {
    console.error(ex.status, ex.code, ex.message);
    throw ex;
  }
})

module.exports = router;
