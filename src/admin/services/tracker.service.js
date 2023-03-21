const { lodash: _ } = require('@serverless-cd/core');
const { NotFoundError, unionToken } = require('../util');

const applicationMode = require('../models/application.mode');
const taskMode = require('../models/task.mode');

function mergeFcResources(source, remote, action) {
  if (_.isEmpty(source)) {
    return remote;
  }
  if (_.isEmpty(remote)) {
    return source;
  }

  const { uid, region, functions = [] } = source || {};
  const sourceFunctions = _.map(functions, (item) => ({
    uid, region, ...item,
  }));

  const { uid: remoteUid, region: remoteRegion } = remote || {};
  const remoteFunctions = _.map(remote.functions, item => ({
    uid: remoteUid,
    region: remoteRegion,
    ...item,
  }));


  let targetFunctions = [];
  if (action === 0) {
    targetFunctions = _.pullAllWith(remoteFunctions, sourceFunctions, _.isEqual);
  } else {
    targetFunctions = _.unionWith(remoteFunctions, sourceFunctions, _.isEqual);
  }

  return {
    uid,
    region,
    functions: _.map(targetFunctions, item => {
      if (item.uid === uid) {
        _.unset(item, 'uid');
      }
      if (item.region === region) {
        _.unset(item, 'region');
      }
      return item;
    }),
  };
}

async function tracker(payload = {}) {
  const {
    source = 'aliyunAppCenter',
    resource = {},
    action = 1, // 0 删除，1 新增
    status, // 成功 ｜ 失败
    appId = '',
    envName = '',
  } = payload;

  if (!(appId || envName)) {
    throw new ValidationError(`必填项参数异常。appId: ${appId}, envName: ${envName}`);
  }

  const appInfo = await applicationMode.getAppById(appId);
  if (_.isEmpty(appInfo)) {
    throw new NotFoundError(`没有找到此应用：${appId}`);
  }

  const needCreateTask = !_.includes(['aliyunAppCenter', 'serverless-cd'], source);
  const taskId = needCreateTask ? unionToken() : '';
  // 写 task 数据
  if (needCreateTask) {
    await taskMode.create({
      id: taskId,
      env_name: envName,
      app_id: appId,
      status,
    });
  }

  // 修改 app 表
  const environment = _.get(appInfo, 'environment', {});
  const targetFcResource = _.get(environment, `${envName}.resource['aliyun.fc']`, {});
  // 将fc相关数据写进app表
  _.set(
    environment,
    `${envName}.resource['aliyun.fc']`,
    mergeFcResources(
      resource['aliyun.fc'],
      targetFcResource,
      action,
    )
  );
  // 将上报相关数据写进app表latest_task
  _.set(environment, `${envName}.latest_task`, { taskId, status, completed: true });
  await applicationMode.updateAppById(appId, { environment });
}

module.exports = { tracker };
