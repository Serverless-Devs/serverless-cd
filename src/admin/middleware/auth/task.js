// 验证登陆task和应用关联关系
const _ = require('lodash');
const { NoPermissionError, NotFoundError } = require('../../util');
const taskMode = require('../../models/task.mode');
const debug = require('debug')('serverless-cd:middleware-auth');

const checkTaskAssociateApp = async (req, _res, next) => {
  const { pathname = '' } = req._parsedUrl;
  const notCheckPath = ['/task/list', '/task/create'];
  if (notCheckPath.includes(pathname)) {
    return next();
  }

  const appId = _.get(req, 'body.appId', _.get(req, 'query.appId'));
  if (_.isEmpty(appId)) {
    next(new NotFoundError('没有找到应用Id'));
  }
  let taskId;
  if (_.startsWith(pathname, '/task')) {
    taskId = _.get(req, 'body.id', _.get(req, 'query.id'));
  } else  {
    taskId = _.get(req, 'body.taskId', _.get(req, 'query.taskId'));
  }
  if (_.isEmpty(taskId)) {
    next(new NotFoundError('没有找到taskId'));
  }

  const taskResult = await taskMode.getTaskById(taskId);
  const app_id = _.get(taskResult, 'app_id', '');
  debug(`appId: ${app_id}`);
  if (app_id !== appId) {
    next(new NoPermissionError(`${appId}不属于应用${appId}`));
  }
  next();
};

module.exports = checkTaskAssociateApp;
