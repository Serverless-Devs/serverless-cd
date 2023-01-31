const { CREDENTIALS, FC } = require('@serverless-cd/config');
const Fc = require('@serverless-cd/srm-aliyun-fc2');

const { region, serviceName, functionName } = FC.workerFunction;

const fcClient = new Fc(CREDENTIALS.accountId, {
  accessKeyID: CREDENTIALS.accessKeyId,
  accessKeySecret: CREDENTIALS.accessKeySecret,
  region,
  timeout: 60 * 1000,
});

async function asyncInvoke(payload) {
  console.log('gen task id is: ', payload.taskId);

  return await fcClient.invokeFunction(
    serviceName,
    functionName,
    JSON.stringify(payload),
    {
      'X-FC-Invocation-Type': 'Async',
      'x-fc-stateful-async-invocation-id': `${payload.taskId}`,
    },
    // process.env.qualifier,
  );
}

module.exports = asyncInvoke;
