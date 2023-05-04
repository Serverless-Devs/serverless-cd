// 验证登陆用户和应用关联关系
const _ = require('lodash');
const { NoPermissionError, NotFoundError } = require('../../util');
const applicationmMode = require('../../models/application.mode');
const debug = require('debug')('serverless-cd:middleware-auth');

const checkAppAssociateUser = async (req, _res, next) => {
  const { pathname = '' } = req._parsedUrl;
  const notCheckPath = ['/application/list', '/application/create', '/application/preview'];
  if (notCheckPath.includes(pathname)) {
    return next();
  }

  const { orgName } = req;
  let appId;
  if (_.startsWith(pathname, '/application')) {
    appId = _.get(req, 'body.id', _.get(req, 'query.id'));
  } else  {
    appId = _.get(req, 'body.appId') || _.get(req, 'query.appId') || _.get(req, 'query.app_id');
  }

  if (_.isEmpty(appId)) {
    next(new NotFoundError('没有找到应用ID'));
  }

  const appResult = await applicationmMode.getAppById(appId);
  const ownerOrgId = _.get(appResult, 'owner_org_id', '');
  const [, appUseOrgName] = _.split(ownerOrgId, ':');
  debug(`ownerOrgId: ${ownerOrgId}, App use org name: ${appUseOrgName}`);
  if (appUseOrgName !== orgName) {
    next(new NoPermissionError(`应用${appId}不属于${orgName}团队`));
  }
  next();
};

module.exports = checkAppAssociateUser;
