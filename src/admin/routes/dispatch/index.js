const router = require('express').Router();
const gitProvider = require('@serverless-cd/git-provider');
const { lodash: _ } = require('@serverless-cd/core');
const { Result, ValidationError, NoPermissionError } = require('../../util');
const { stopStatefulAsyncInvocations } = require('../../util/invoke');
const { OTS_APPLICATION, OTS_USER, OTS_TASK } = require('../../config');
const appOrm = require('../../util/orm')(OTS_APPLICATION.name, OTS_APPLICATION.index);
const userOrm = require('../../util/orm')(OTS_USER.name, OTS_USER.index);
const taskOrm = require('../../util/orm')(OTS_TASK.name, OTS_TASK.index);
const { invokWorker } = require('./util');

// 手动部署
router.post('/manual', async function (req, res) {
  console.log('disaptch manual req.body', JSON.stringify(req.body));
  const { appId, commitId, ref, message, inputs } = req.body;
  if (_.isEmpty(appId)) {
    throw new ValidationError('appId 必填');
  }
  if (_.isNil(ref)) {
    throw new ValidationError('ref 必填');
  }
  const userId = req.userId;
  const applicationResult = await appOrm.findByPrimary([{ id: appId }]);
  if (_.isEmpty(applicationResult)) {
    throw new ValidationError('没有查到应用信息');
  }
  const { owner, provider, repo_name, repo_url, secrets, environment, user_id } = applicationResult;
  if (user_id !== userId) {
    throw new ValidationError('无权操作此应用');
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
      throw new ValidationError(`获取 ${provider} 信息失败: ${ex}`);
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
    environment,
    envName: _.first(_.keys(environment)),
    customInputs: inputs,
  };

  console.log('invoke payload: ', payload);

  invokWorker(payload, res);
});

//  重新 / 回滚
router.post('/redeploy', async function (req, res) {
  console.log('disaptch redeploy req.body', JSON.stringify(req.body));
  const { taskId, appId } = req.body;
  if (_.isEmpty(taskId)) {
    throw new ValidationError('taskId 必填');
  }

  if (_.isEmpty(appId)) {
    throw new ValidationError('appId 必填');
  }

  const userId = req.userId;

  const taskResult = await taskOrm.findByPrimary([{ id: taskId }]);
  if (_.isEmpty(taskResult)) {
    throw new ValidationError('没有查到部署信息');
  }
  const { trigger_payload, user_id } = taskResult;

  if (user_id !== userId) {
    throw new ValidationError('无权操作此应用');
  }

  const applicationResult = await appOrm.findByPrimary([{ id: appId }]);
  if (_.isEmpty(applicationResult)) {
    throw new ValidationError('没有查到应用信息');
  }
  const { environment } = applicationResult;

  trigger_payload.environment = { ...environment, ...trigger_payload.environment };

  console.log('invoke payload: ', trigger_payload);

  trigger_payload.redelivery = taskId;
  await invokWorker(trigger_payload, res);
});

// 取消部署
router.post('/cancel', async function (req, res) {
  console.log('disaptch cancel req.body', JSON.stringify(req.body));
  const { taskId } = req.body;
  if (_.isEmpty(taskId)) {
    throw new ValidationError('taskId 必填');
  }
  const taskResult = await taskOrm.findByPrimary([{ id: taskId }]);

  if (_.isEmpty(taskResult)) {
    throw new ValidationError('没有查到部署信息');
  }
  const { user_id, steps, app_id, trigger_payload } = taskResult;
  if (user_id !== req.userId) {
    throw new NoPermissionError('无权操作此应用');
  }

  try {
    await stopStatefulAsyncInvocations(taskId);
  } catch (e) {
    console.log('cancel task error: ', e);
    if (e.code === 412) {
      throw new ValidationError('任务运行已经被停止');
    }
    throw new Error(e.toString());
  }

  const cancelStatus = 'cancelled';
  const running = 'running';
  await taskOrm.update([{ id: taskId }], {
    status: cancelStatus,
    steps: steps.map(({ run, stepCount, status }) => ({
      run,
      stepCount,
      status: status === running ? cancelStatus : status,
    })),
  });

  const { commit, message, ref, environment, envName } = trigger_payload || {};

  environment[envName].latest_task = {
    taskId,
    commit,
    message,
    ref,
    completed: true,
    status: cancelStatus,
  };
  await appOrm.update([{ id: app_id }], {
    environment,
  });

  return res.json(Result.ofSuccess());
});

module.exports = router;
