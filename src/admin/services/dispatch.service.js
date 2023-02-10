const _ = require('lodash');
const debug = require('debug')('serverless-cd:dispatch');
const taskService = require('./task.service');
const taskModel = require('../models/task.mode');
const applicationService = require('./application.service');

const { ValidationError, Client, unionToken } = require('../util');
const {
  FC: { workerFunction: { region, serviceName, functionName } },
  TASK_STATUS: { CANCEL, RUNNING }
} = require('@serverless-cd/config');

async function retryOnce(fnName, ...args) {
  try {
    return await Client.fc(region)[fnName](...args);
  } catch (error) {
    return await Client.fc(region)[fnName](...args);
  }
}

async function redeploy(body = {}, userId) {
  const { taskId, appId } = body;
  if (_.isEmpty(taskId)) {
    throw new ValidationError('taskId 必填');
  }
  if (_.isEmpty(appId)) {
    throw new ValidationError('appId 必填');
  }

  const taskResult = await taskService.detail(taskId);
  if (_.isEmpty(taskResult)) {
    throw new ValidationError('没有查到部署信息');
  }

  const applicationResult = await applicationService.getAppById(appId);
  if (_.isEmpty(applicationResult)) {
    throw new ValidationError('没有查到应用信息');
  }

  const trigger_payload = _.get(taskResult, 'trigger_payload');
  const environment = _.get(applicationResult, 'environment', {});
  const newTaskId = unionToken();

  _.set(trigger_payload, 'redelivery', taskId);
  _.set(trigger_payload, 'taskId', newTaskId);
  _.set(trigger_payload, 'userId', userId);
  _.set(trigger_payload, 'environment', {
    ...environment,
    ...trigger_payload.environment || {},
  });

  const asyncInvokeRes = await retryOnce(
    'invokeFunction',
    serviceName,
    functionName,
    JSON.stringify(trigger_payload),
    {
      'X-FC-Invocation-Type': 'Async',
      'x-fc-stateful-async-invocation-id': newTaskId,
    },
    // process.env.qualifier,
  );

  return {
    'x-fc-request-id': _.get(asyncInvokeRes, 'headers[x-fc-request-id]'),
    taskId: newTaskId,
  }
}

async function cancelTask(body = {}) {
  const { taskId } = body;
  if (_.isEmpty(taskId)) {
    throw new ValidationError('taskId 必填');
  }

  const taskResult = await taskService.detail(taskId);
  if (_.isEmpty(taskResult)) {
    throw new ValidationError('没有查到部署信息');
  }

  const { steps = [], app_id, trigger_payload } = taskResult;
  try {
    const path = `/services/${serviceName}/functions/${functionName}/stateful-async-invocations/${taskId}`;
    await retryOnce('put', path);
  } catch (e) {
    debug(`cancel invoke error: ${e.code}, ${e.message}`);
    if (e.code === 412 || e.code === 'StatefulAsyncInvocationAlreadyCompleted') {
      throw new ValidationError('任务运行已经被停止');
    }
    throw new Error(e.toString());
  }

  const updateTaskPayload = {
    status: CANCEL,
    steps: _.map(steps, ({ run, stepCount, status }) => ({
      run,
      stepCount,
      status: status === RUNNING ? CANCEL : status,
    })),
  };
  console.log('updateTaskPayload: ', updateTaskPayload);
  await taskModel.updateTask(taskId, updateTaskPayload);

  const { commit, message, ref, environment, envName } = trigger_payload || {};
  environment[envName].latest_task = {
    taskId,
    commit,
    message,
    ref,
    completed: true,
    status: CANCEL,
  };
  await applicationService.update(app_id, { environment });
}

module.exports = {
  redeploy,
  cancelTask,
};