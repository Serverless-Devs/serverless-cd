const _ = require('lodash');
const { default: Client } = require('@alicloud/fc-open20210406');
const {
  CREDENTIALS,
  FC: { workerFunction },
  TASK_STATUS,
} = require('@serverless-cd/config');
const { updateAppEnvById, getTask, makeTask } = require('./model');

const { RUNNING, FAILURE: FAILED_STATUS } = TASK_STATUS;

const qualifier = 'LATEST';
const { region, serviceName, functionName } = workerFunction;
const client = new Client({
  accessKeyId: CREDENTIALS.accessKeyId,
  accessKeySecret: CREDENTIALS.accessKeySecret,
  securityToken: CREDENTIALS.securityToken,
  endpoint: `${CREDENTIALS.accountId}.${region}.fc.aliyuncs.com`,
  readTimeout: 10 * 1000,
});

async function retryFunctions(f, ...args) {
  try {
    console.log(...args);
    return await client[f](...args);
  } catch (err) {
    console.log(`fetch ${f} error`);
    return await client[f](...args);
  }
}

async function getWorkerMaxAsyncRetryAttempts() {
  const result = await retryFunctions('getFunctionAsyncInvokeConfig', serviceName, functionName, {
    qualifier,
  });
  return _.get(result, 'body.maxAsyncRetryAttempts', 0);
}

async function getStatefulAsyncInvocationStatus(taskId) {
  const { body: statefulRes } = await retryFunctions(
    'getStatefulAsyncInvocation',
    serviceName,
    functionName,
    taskId,
    { qualifier },
  );
  return _.get(statefulRes, 'status');
}

async function handler(event, context, callback) {
  const eventPayload = JSON.parse(event.toString());
  console.debug(eventPayload);

  const { approximateInvokeCount } = eventPayload.requestContext;
  console.debug(`approximateInvokeCount: ${approximateInvokeCount}`);
  const workerMaxRetryAttempts = await getWorkerMaxAsyncRetryAttempts();
  console.debug(`workerMaxRetryAttempts: ${workerMaxRetryAttempts}`);
  // 仅仅最后一次 retry 生效
  if (approximateInvokeCount - 1 !== workerMaxRetryAttempts) {
    console.debug(
      `approximateInvokeCount is ${approximateInvokeCount}, WORKER_MAX_RETRY_ATTEMPTS is ${Number(
        WORKER_MAX_RETRY_ATTEMPTS || '0',
      )}, skipping`,
    );
    return callback();
  }

  const payload = JSON.parse(eventPayload.requestPayload);
  console.debug('payload: ', payload);
  const {
    token: jwt_token,
    taskId,
    commit,
    message,
    envName,
    ref,
    userId,
    authorization: { appId, dispatchOrgId } = {},
    environment = {},
    trigger_type,
  } = payload || {};

  if (!(taskId || appId || envName)) {
    throw new Error(`taskId: ${taskId}, appId: ${appId}, envName: ${envName} cannot be empty`);
  }

  /*
    1. 内部程序执行失败  Failed
    2. 执行超时        Failed
    3. 手动取消 // Stopping / Stopped
  */
  const [,orgName] = _.split(dispatchOrgId, ':');
  const statefulAsyncInvocationStatus = await getStatefulAsyncInvocationStatus(taskId);
  if (statefulAsyncInvocationStatus === 'Failed') {
    const appTaskConfig = { taskId, commit, message, ref, trigger_type };

    const latestTask = {
      ...appTaskConfig,
      completed: true,
      status: FAILED_STATUS,
    };
    await updateAppEnvById(jwt_token, orgName, appId, envName, latestTask);

    let makeTaskPayload = {};
    const dbConfig = await getTask(jwt_token, orgName, appId, taskId);
    if (dbConfig.id && !_.isEmpty(dbConfig.steps)) {
      makeTaskPayload = {
        status: FAILED_STATUS,
        steps: dbConfig.steps.map(({ run, stepCount, status }) => ({
          run,
          stepCount,
          status: status === RUNNING ? FAILED_STATUS : status,
        })),
      };
    } else {
      makeTaskPayload = {
        env_name: envName,
        user_id: userId,
        app_id: appId,
        status: FAILED_STATUS,
        trigger_payload: payload,
      };
    }
    await makeTask(jwt_token, orgName, appId, taskId, makeTaskPayload);
  } else {
    console.debug('statefulAsyncInvocationStatus not is Failed, skip');
  }
  callback();
}

exports.handler = handler;
