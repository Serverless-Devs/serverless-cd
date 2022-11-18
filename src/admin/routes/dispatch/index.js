const router = require('express').Router();
const gitProvider = require('@serverless-cd/git-provider');
const { lodash: _ } = require('@serverless-cd/core');
const {
  unionid,
  generateErrorResult,
  generateSuccessResult,
  ValidationError,
} = require('../../util');
const { asyncInvoke, stopStatefulAsyncInvocations } = require('../../util/invoke');
const { OTS_APPLICATION, OTS_USER, OTS_SESSION, OTS_TASK } = require('../../config');
const appOrm = require('../../util/orm')(OTS_APPLICATION.name, OTS_APPLICATION.index);
const userOrm = require('../../util/orm')(OTS_USER.name, OTS_USER.index);
const taskOrm = require('../../util/orm')(OTS_TASK.name, OTS_TASK.index);


const invokingWorker = async (payload, res) =>{
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
    generateSuccessResult({
      'x-fc-request-id': _.get(asyncInvokeRes, 'headers[x-fc-request-id]'),
      taskId,
    }),
  );
}

// 手动部署
router.post('/manual', async function (req, res) {
  console.log('disaptch manual req.body', JSON.stringify(req.body));
  const { appId, commitId, ref, message, inputs } = req.body;
  if (_.isEmpty(appId)) {
    return res.json(generateErrorResult('appId 必填'));
  }
  if (_.isNil(ref)) {
    return res.json(generateErrorResult('ref 必填'));
  }
  const { userId } = req.session;

  const applicationResult = await appOrm.findByPrimary([{ id: appId }]);
  if (_.isEmpty(applicationResult)) {
    return res.json(generateErrorResult('没有查到应用信息'));
  }
  const { owner, provider, repo_name, repo_url, secrets, trigger_spec, user_id } =
    applicationResult;
  if (user_id !== userId) {
    return res.json(generateErrorResult('无权操作此应用'));
  }

  console.log('find provider access token');
  const userResult = await userOrm.findByPrimary([{ id: userId }]);
  const providerToken = _.get(userResult, `third_part.${provider}.access_token`, '');
  if (_.isEmpty(providerToken)) {
    throw new ValidationError(`Provider access token not found`);
  }
  console.log('find provider access token end');

  console.log('get commit config');
  let commit = commitId;
  let msg = message || '';
  if (!commit) {
    try {
      const prioverd = gitProvider(provider, { access_token: providerToken });
      // commitId
      const commitConfig = await prioverd.getRefCommit({
        owner,
        ref,
        repo: repo_name,
      });
      commit = commitConfig.sha;
      msg = commitConfig.message;
    } catch (ex) {
      console.error(ex);
      return res.json(generateErrorResult(`获取 ${provider} 信息失败: ${ex}`));
    }
  }
  console.log('get commit config end');

  const payload = {
    provider,
    cloneUrl: repo_url,
    authorization: {
      userId,
      appId,
      owner,
      accessToken: providerToken,
      secrets,
    },
    ref,
    message: msg,
    commit,
    trigger_spec,
    trigger: {
      interceptor: 'manual_dispatch',
      template: "serverless-pipeline.yaml",
    },
    customInputs: inputs,
  };

  console.log('invoke payload: ', payload);

  invokingWorker(payload, res)
});

//  重新 / 回滚
router.post('/redeploy', async function (req, res) {
  console.log('disaptch redeploy req.body', JSON.stringify(req.body));
  const { taskId } = req.body;
  if (_.isEmpty(taskId)) {
    return res.json(generateErrorResult('taskId 必填'));
  }

  const { userId } = req.session;

  const taskResult = await taskOrm.findByPrimary([{ id: taskId }]);
  if (_.isEmpty(taskResult)) {
    return res.json(generateErrorResult('没有查到部署信息'));
  }
  const { trigger_payload, user_id } = taskResult;

  if (user_id !== userId) {
    return res.json(generateErrorResult('无权操作此应用'));
  }

  console.log('invoke payload: ', trigger_payload);

  trigger_payload.redelivery = taskId;
  invokingWorker(trigger_payload, res);

});

// 取消部署
router.post('/cancel', async function (req, res) {
  console.log('disaptch cancel req.body', JSON.stringify(req.body));
  const { taskId } = req.body;
  if (_.isEmpty(taskId)) {
    return res.json(generateErrorResult('taskId 必填'));
  }
  const taskResult = await taskOrm.findByPrimary([{ id: taskId }]);

  if (_.isEmpty(taskResult)) {
    return res.json(generateErrorResult('没有查到部署信息'));
  }
  const { user_id, steps, app_id, trigger_payload } = taskResult;
  if (user_id !== req.session.userId) {
    return res.json(generateErrorResult('无权操作此应用'));
  }

  try {
    await stopStatefulAsyncInvocations(taskId);
  } catch (e) {
    console.log('cancel task error: ', e);
    if (e.code === 412) {
      return res.json(generateErrorResult('任务运行已经被停止'));
    }
    return res.json(generateErrorResult(e.toString()));
  }

  const cancelStatus = 'cancelled';
  const running = 'running';
  await taskOrm.update([{ id: taskId }], {
    status: cancelStatus,
    steps: steps.map(({ run, stepCount, status }) => ({
      run,
      stepCount,
      status: status === running ? cancelStatus : status
    }))
  });

  const { commit, message, ref } = trigger_payload || {};
  await appOrm.update([{ id: app_id }], {
    latest_task: {
      taskId,
      commit,
      message,
      ref,
      completed: true,
      status: cancelStatus,
    }
  });

  return res.json(generateSuccessResult());
});

module.exports = router;
