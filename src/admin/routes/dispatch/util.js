const { lodash: _ } = require('@serverless-cd/core');
const { unionid, Result } = require('../../util');
const { asyncInvoke } = require('../../util/invoke');

module.exports = {
  invokWorker: async (payload, res) => {
    const taskId = unionid();
    payload.taskId = taskId;
    let asyncInvokeRes;
    // 调用 worker
    try {
      asyncInvokeRes = await asyncInvoke(payload);
    } catch (ex) {
      console.log(`invoke worker function error: ${ex}. Retry`);
      asyncInvokeRes = await asyncInvoke(payload);
    }

    console.log('asyncInvokeRes:: ', asyncInvokeRes);
    res.json(
      Result.ofSuccess({
        'x-fc-request-id': _.get(asyncInvokeRes, 'headers[x-fc-request-id]'),
        taskId,
      }),
    );
  },
};
