const router = require('express').Router();
const webhook = require('./webhook');
const { lodash: _ } = require('@serverless-cd/core');
const { Result, unionid, ValidationError } = require('../../util');
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
  const { repo, owner, repo_url, provider_repo_id, description, provider, environment } = req.body;
  const userId = req.userId;

  const userInfo = await userOrm.find({ id: userId });
  console.log('用户信息', JSON.stringify(userInfo, null, 2));
  const token = _.get(userInfo, `result[0].third_part.${provider}.access_token`, false);

  if (!token) {
    throw new ValidationError(`${provider} 授权 token 不存在，请重新授权`);
  }

  const application = await orm.findOne({
    user_id: userId,
    provider,
    provider_repo_id,
  });
  if (!_.isEmpty(application)) {
    throw new ValidationError('代码仓库已绑定，请勿重新绑定');
  }

  console.log('add app');
  const webHookSecret = unionid();
  const id = unionid();
  await webhook.add(owner, repo, token, webHookSecret, id);

  await orm.create([{ id }], {
    user_id: userId,
    provider,
    provider_repo_id,
    repo_name: repo,
    owner,
    description,
    repo_url,
    environment,
    webhook_secret: webHookSecret,
  });

  return res.json(Result.ofSuccess({ id }));
});

router.get('/list', async function (req, res, next) {
  console.log('application list req.user', req.userId);
  const userId = req.userId;
  const applicationResult = await orm.findAll({
    user_id: userId,
    orderKeys: ['updated_time', 'created_time'],
  });
  const applicationList = _.get(applicationResult, 'result', []);
  console.log('应用列表信息', applicationResult);

  res.json(Result.ofSuccess(getApplicationConfig(applicationList)));
});

router.get('/detail', async function (req, res, next) {
  console.log('application detail req.query', JSON.stringify(req.query));
  const { id } = req.query;
  const applicationResult = await orm.findByPrimary([{ id }]);
  console.log('当前应用信息', applicationResult);

  if (_.isEmpty(applicationResult)) {
    throw new ValidationError('暂无应用信息');
  }

  res.json(Result.ofSuccess(_.first(getApplicationConfig([applicationResult]))));
});

router.delete('/delete', async function (req, res) {
  console.log('DETELE /delete app QUERY ', JSON.stringify(req.query));
  const { appId } = req.query;
  const userId = req.userId;
  const app = await orm.findOne({ id: appId });
  if (_.isEmpty(app)) {
    throw new ValidationError('没有找到此应用');
  }

  const taskResult = await taskOrm.findAll({ user_id: userId, app_id: appId });
  const taskList = _.get(taskResult, 'result', []);
  if (!_.isEmpty(taskList)) {
    const primaryKeys = _.map(taskList, ({ id }) => [{ id }]);
    console.log('primaryKeys:', primaryKeys);
    await taskOrm.batchDelete(primaryKeys);
  }
  await orm.delete([{ id: appId }]);
  // 尝试删除应用的 webhook
  const { owner, repo_name, trigger_spec, provider } = app;
  const token = _.get(trigger_spec, `${provider}.secret`);
  await webhook.remove(owner, repo_name, token, appId);
  res.json(Result.ofSuccess({ message: '删除应用成功' }));
});

router.post('/update', async function (req, res) {
  console.log('POST /update app ', JSON.stringify(req.body));
  const { appId, secrets, trigger_spec = {}, provider } = req.body;

  const app = await orm.findOne({ id: appId });
  if (_.isEmpty(app)) {
    throw new ValidationError('没有找到此应用');
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
  res.json(Result.ofSuccess());
});

module.exports = router;
