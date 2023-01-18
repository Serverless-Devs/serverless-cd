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
      asyncInvokeRes = await asyncInvoke(payload);
    }

    res.json(
      Result.ofSuccess({
        'x-fc-request-id': _.get(asyncInvokeRes, 'headers[x-fc-request-id]'),
        taskId,
      }),
    );
  },
};
