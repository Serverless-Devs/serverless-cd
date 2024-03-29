const { lodash: _ } = require('@serverless-cd/core');
const { NotFoundError, unionToken } = require('../util');

const applicationMode = require('../models/application.mode');
const orgMode = require('../models/org.mode');
const taskMode = require('../models/task.mode');

function mergeFcResources(platform, remote) {
  if (_.isEmpty(platform)) {
    return remote;
  }
  if (_.isEmpty(remote)) {
    return platform;
  }

  return _.unionWith(remote, platform, _.isEqual);
}

async function tracker(orgName, payload = {}) {
  const {
    platform = 'app_center',
    status, // 成功 ｜ 失败
    name,
    envName = 'default',
    resource = {},
    time: updated_time = new Date().getTime(),
  } = payload;
  if (_.isEmpty(name)) {
    throw new ValidationError('必填项应用名称为空参数异常');
  }
  const { id: owner_org_id } = await orgMode.getOwnerOrgByName(orgName);
  const appInfo = await applicationMode.getAppByAppName({ owner_org_id, name });
  if (_.isEmpty(appInfo)) {
    throw new NotFoundError(`没有找到此应用：${name}`);
  }
  const environment = _.get(appInfo, 'environment', {});
  if (_.isEmpty(_.get(environment, envName))) {
    throw new NotFoundError(`没有找到应用${name}对应的环境${envName}`);
  }

  // task 数据处理
  const needCreateTask = !_.includes(['app_center', 'serverless_cd'], platform);
  const taskId = needCreateTask ? unionToken() : '';
  const triggerType = `tracker:${platform}`;
  if (needCreateTask) {
    await taskMode.create({
      id: taskId,
      env_name: envName,
      app_id: appInfo.id,
      trigger_type: triggerType,
      status,
    });
  }

  // 修改 app 表
  const targetFcResource = _.get(environment, `${envName}.resource.fc`, {});
  // 将fc相关数据写进app表
  _.set(environment, `${envName}.resource.fc`, mergeFcResources(resource.fc, targetFcResource));
  // 将上报相关数据写进app表latest_task
  _.set(environment, `${envName}.latest_task`, {
    updated_time,
    taskId,
    status,
    trigger_type: triggerType,
    completed: true,
  });
  await applicationMode.updateAppById(appInfo.id, { environment });

  return { taskId };
}

module.exports = { tracker };
