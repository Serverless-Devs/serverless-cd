const { FC } = require('../config');
const Client = require('./client');
const { region, serviceName, functionName } = FC.workerFunction;

async function asyncInvoke(payload) {
  console.log('gen task id is: ', payload.taskId);

  return await Client.fc(region).invokeFunction(
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

async function stopStatefulAsyncInvocations(statefulAsyncInvocationId) {
  console.log('stateful async invocation id(task id) is: ', statefulAsyncInvocationId);
  const path = `/services/${serviceName}/functions/${functionName}/stateful-async-invocations/${statefulAsyncInvocationId}`;
  return await Client.fc(region).put(path);
}

module.exports = {
  asyncInvoke,
  stopStatefulAsyncInvocations,
};
