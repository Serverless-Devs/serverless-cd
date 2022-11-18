const Client = require('@alicloud/fc-open20210406').default;
const otsTask = require('./model/task');
const otsApp = require('./model/app');
const { CREDENTIALS } = require('./config');

const { WORKER_MAX_RETRY_ATTEMPTS, REGION, SERVICE_NAME, WORKER_FUNCTION_NAME } = process.env;

async function handler(event, context, callback) {
  const eventPayload = JSON.parse(event.toString());
  console.debug(eventPayload);
  const { approximateInvokeCount } = eventPayload.requestContext;
  // 仅仅最后一次 retry 生效
  if (approximateInvokeCount - 1 !== Number(WORKER_MAX_RETRY_ATTEMPTS || '0')) {
    console.debug(
      `approximateInvokeCount is ${approximateInvokeCount}, WORKER_MAX_RETRY_ATTEMPTS is ${Number(
        WORKER_MAX_RETRY_ATTEMPTS || '0',
      )}, skipping`,
    );
    return callback();
  }

  const payload = JSON.parse(eventPayload.requestPayload);
  console.debug('payload: ', payload);
  const { taskId, commit, message, ref, authorization: { appId, userId } = {} } = payload || {};

  if (!(taskId || appId || userId)) {
    throw new Error(`taskId: ${taskId}, appId: ${appId}, userId: ${userId} cannot be empty`);
  }

  const region = REGION;
  const serviceName = SERVICE_NAME;
  const functionName = WORKER_FUNCTION_NAME;
  const qualifier = 'LATEST';
  const { accountId, accessKeyId, accessKeySecret } = CREDENTIALS || {};

  console.debug('region: ', region);
  console.debug('serviceName: ', serviceName);
  console.debug('functionName: ', functionName);
  console.debug('qualifier: ', qualifier);
  console.debug('invocationId: ', taskId);
  console.debug('accountId: ', accountId);

  const popClient = new Client({
    accessKeyId,
    accessKeySecret,
    regionId: region,
    // securityToken: securityToken,
    endpoint: `${accountId}.${region}.fc.aliyuncs.com`,
    readTimeout: 30 * 1000,
  });

  let statefulAsyncInvocationStatus;
  try {
    const { body: statefulRes } = await popClient.getStatefulAsyncInvocation(
      serviceName,
      functionName,
      taskId,
      { qualifier },
    );
    console.debug('statefulRes: ', statefulRes);
    statefulAsyncInvocationStatus = statefulRes.status;
  } catch (ex) {
    // TODO: 告警
    throw ex;
  }

  /*
    1. 内部程序执行失败  Failed
    2. 执行超时        Failed
    3. 手动取消 // Stopping / Stopped
  */
  if (statefulAsyncInvocationStatus === 'Failed') {
    const RUNNING = 'running';
    const FAILED_STATUS = 'failure';
    const appTaskConfig = { taskId, commit, message, ref };

    await otsApp.update(appId, {
      latest_task: { ...appTaskConfig, completed: true, status: FAILED_STATUS },
    });

    const dbConfig = await otsTask.find(taskId);
    if (dbConfig.id) {
      await otsTask.make(taskId, {
        status: FAILED_STATUS,
        steps: dbConfig.steps.map(({ run, stepCount, status }) => ({
          run,
          stepCount,
          status: status === RUNNING ? FAILED_STATUS : status,
        })),
      });
    } else {
      await otsTask.make(taskId, {
        user_id: userId,
        app_id: appId,
        status: FAILED_STATUS,
        // steps: [],
        trigger_payload: payload,
      });
    }
  } else {
    console.debug('statefulAsyncInvocationStatus not is Failed, skip');
  }
  callback();
}

exports.handler = handler;
