const _ = require('lodash');
const debug = require('debug')('serverless-cd:dispatch');
const gitProvider = require('@serverless-cd/git-provider');

const taskModel = require('../models/task.mode');
const orgModel = require('../models/org.mode');
const applicationModel = require('../models/application.mode');

const taskService = require('./task.service');
const orgService = require('./org.service');

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

async function invokeFunction(trigger_payload) {
  return await retryOnce(
    'invokeFunction',
    serviceName,
    functionName,
    JSON.stringify(trigger_payload),
    {
      'X-FC-Invocation-Type': 'Async',
      'x-fc-stateful-async-invocation-id': trigger_payload.taskId,
    },
    // process.env.qualifier,
  );;
}

async function redeploy(dispatchOrgId, orgName, { taskId, appId } = {}) {
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

  const trigger_payload = _.get(taskResult, 'trigger_payload');
  const envName = _.get(trigger_payload, 'envName', '');
  if (_.isEmpty(envName)) {
    throw new ValidationError('没有找到被触发的环境名称');
  }

  const applicationResult = await applicationModel.getAppById(appId);
  if (_.isEmpty(applicationResult)) {
    throw new ValidationError('没有查到应用信息');
  }
  const { owner, provider, environment, owner_org_id } = applicationResult;
  // 设置新的环境信息
  if (_.isEmpty(environment[envName])) {
    throw new ValidationError(`当前不存在${envName}环境`);
  }
  _.unset(environment, 'latest_task');
  _.set(trigger_payload, 'environment', environment);

  // 重新设置新的 task id
  const newTaskId = unionToken();
  _.set(trigger_payload, 'redelivery', taskId);
  _.set(trigger_payload, 'taskId', newTaskId);

  // 设置新的auth信息
  const ownerOrgData = await orgModel.getOrgById(owner_org_id);

  const ownerSecrets = _.get(ownerOrgData, 'secrets') || {};
  const appSecrets = _.get(environment, `${envName}.secrets`) || {};

  const providerToken = await orgService.getProviderToken(orgName, provider);
  _.merge(trigger_payload.authorization, {
    secrets: _.merge(ownerSecrets, appSecrets),
    dispatchOrgId,
    owner,
    accessToken: providerToken,
  });

  // 调用函数
  const asyncInvokeRes = await invokeFunction(trigger_payload);
  return {
    'x-fc-request-id': _.get(asyncInvokeRes, 'headers[x-fc-request-id]'),
    taskId: newTaskId,
  }
}

async function cancelTask({ taskId } = {}) {
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
  debug(`updateTaskPayload: ${JSON.stringify(updateTaskPayload)}`);
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
  await applicationService.updateAppById(app_id, { environment });
}

async function manualTask(dispatchOrgId, orgName, body = {}) {
  const { appId, commitId, ref, message, inputs, envName } = body;
  if (_.isEmpty(appId)) {
    throw new ValidationError('appId 必填');
  }
  if (_.isNil(ref)) {
    throw new ValidationError('ref 必填');
  }

  const applicationResult = await applicationModel.getAppById(appId);
  if (_.isEmpty(applicationResult)) {
    throw new ValidationError('没有查到应用信息');
  }

  const { owner, provider, repo_name, repo_url, environment, owner_org_id } = applicationResult;

  debug('find provider access token');
  const providerToken = await orgService.getProviderToken(orgName, provider);
  if (_.isEmpty(providerToken)) {
    throw new ValidationError(`${provider} 密钥查询异常`);
  }
  debug('find provider access token end');

  debug('get commit config');
  let commit = commitId;
  let msg = message || '';
  if (!commit) {
    try {
      const providerClient = gitProvider(provider, { access_token: providerToken });
      const commitConfig = await providerClient.getRefCommit({
        owner,
        ref,
        repo: repo_name,
      });
      commit = commitConfig.sha;
      msg = commitConfig.message;
    } catch (ex) {
      console.error(ex);
      throw new ValidationError(`获取 ${provider} 信息失败: ${ex}`);
    }
  }
  debug('get commit config end');
  debug('get org owner secrets');
  const ownerOrgData = await orgModel.getOrgById(owner_org_id);
  const ownerSecrets = _.get(ownerOrgData, 'secrets', {});
  debug('get org owner successfully');

  const targetEnvName = envName ? envName : _.first(_.keys(environment));
  const payload = {
    taskId: unionToken(),
    provider,
    cloneUrl: repo_url,
    authorization: {
      dispatchOrgId,
      appId,
      owner,
      accessToken: providerToken,
      secrets: _.merge(ownerSecrets, _.get(environment, `${targetEnvName}.secrets`, {})),
    },
    ref,
    message: msg,
    commit,
    environment,
    envName: targetEnvName,
    customInputs: inputs,
  };
  debug(`manual run task ${targetEnvName}, payload: ${JSON.stringify(payload)}`);

  const asyncInvokeRes = await invokeFunction(payload);
  return {
    'x-fc-request-id': _.get(asyncInvokeRes, 'headers[x-fc-request-id]'),
    taskId: payload.taskId,
  };
}

module.exports = {
  manualTask,
  redeploy,
  cancelTask,
  invokeFunction,
};