const router = require('express').Router();
const addWebhook = require('./add-webhook');
const { lodash: _ } = require('@serverless-cd/core');
const { generateSuccessResult, generateErrorResult, unionid } = require('../../util');
const { OTS_APPLICATION, OTS_USER, OTS_TASK } = require('../../config');
const orm = require('../../util/orm')(OTS_APPLICATION.name, OTS_APPLICATION.index);
const userOrm = require('../../util/orm')(OTS_USER.name, OTS_USER.index);
const taskOrm = require('../../util/orm')(OTS_TASK.name, OTS_TASK.index);

const getApplicationConfig = (applicationList) => {
  const omitList = [];
  result = _.map(applicationList, (item) => _.omit(item, omitList));
  return result;
};

router.post('/create', async function (req, res, next) {
  console.log('application create req.body', JSON.stringify(req.body));
  const {
    repo,
    owner,
    repo_url,
    provider_repo_id,
    description,
    provider,
    trigger_spec,
    envs,
    secrets,
  } = req.body;
  const { userId } = req.session;

  const userInfo = await userOrm.find({ id: userId });
  console.log('用户信息', JSON.stringify(userInfo, null, 2));
  const token = _.get(userInfo, `result[0].third_part.${provider}.access_token`, false);

  if (!token) {
    return res.json(generateErrorResult(`${provider} 授权 token 不存在，请重新授权`));
  }

  const application = await orm.findOne({
    user_id: userId,
    provider,
    provider_repo_id,
  });
  if (!_.isEmpty(application)) {
    return generateErrorResult('代码仓库已绑定，请勿重新绑定');
  }

  console.log('add app');
  let webHookSecret = _.get(trigger_spec, `${provider}.secret`);
  if (!webHookSecret) {
    webHookSecret = unionid();
    _.set(trigger_spec, `${provider}.secret`, webHookSecret);
  }
  await addWebhook(owner, repo, token, webHookSecret, userId);

  const id = unionid();
  await orm.create(
    [
      { id },
    ],
    {
      user_id: userId,
      provider,
      provider_repo_id,
      repo_name: repo,
      owner,
      description,
      repo_url,
      trigger_spec,
      envs,
      secrets,
    },
  );

  return res.json(generateSuccessResult({ id }));
});

router.get('/list', async function (req, res, next) {
  console.log('application list req.session', JSON.stringify(req.session));
  const { userId } = req.session;
  const applicationResult = await orm.findAll({
    user_id: userId,
    orderKeys: ['updated_time', 'created_time'],
  });
  const applicationList = _.get(applicationResult, 'result', []);
  console.log('应用列表信息', applicationResult);

  res.json(generateSuccessResult(getApplicationConfig(applicationList)));
});

router.get('/detail', async function (req, res, next) {
  console.log('application detail req.query', JSON.stringify(req.query));
  const { id } = req.query;
  const applicationResult = await orm.findByPrimary([{ id }]);
  console.log('当前应用信息', applicationResult);

  if (_.isEmpty(applicationResult)) {
    return res.json(generateErrorResult('暂无应用信息'));
  }

  res.json(generateSuccessResult(getApplicationConfig([applicationResult])[0]));
});

router.delete('/delete', async function (req, res) {
  console.log('DETELE /delete app QUERY ', JSON.stringify(req.query));
  const { appId } = req.query;
  const { userId } = req.session;
  const app = await orm.findOne({ id: appId });
  if (_.isEmpty(app)) {
    return res.json(generateErrorResult('没有找到此应用'));
  }

  const taskResult = await taskOrm.findAll({ user_id: userId, app_id: appId });
  const taskList = _.get(taskResult, 'result', []);
  if (!_.isEmpty(taskList)) {
    const primaryKeys = _.map(taskList, ({ id }) => [
      { id },
    ]);
    console.log('primaryKeys:', primaryKeys);
    await taskOrm.batchDelete(primaryKeys);
  }
  await orm.delete([{ id: appId }]);
  res.json(generateSuccessResult({ message: '删除应用成功' }));
});

router.post('/update', async function (req, res) {
  console.log('POST /update app ', JSON.stringify(req.body));
  const { appId, secrets, trigger_spec = {}, provider } = req.body;

  const app = await orm.findOne({ id: appId });
  if (_.isEmpty(app)) {
    return generateErrorResult('没有找到此应用');
  }

  const params = {};
  if (!_.isEmpty(trigger_spec)) {
    let webHookSecret = _.get(app, `trigger_spec.${provider}.secret`);
    _.set(trigger_spec, `${provider}.secret`, webHookSecret);
    params.trigger_spec = trigger_spec;
  }
  if (secrets) {
    params.secrets = secrets;
  }

  console.log('/update app params ', params);

  await orm.update([{ id: app.id }], params);
  res.json(generateSuccessResult());
});

module.exports = router;
