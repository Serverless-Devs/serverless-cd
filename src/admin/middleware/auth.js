const { NoPermissionError, NoAuthError } = require('../util');
const authService = require('../services/auth.service');
const debug = require('debug')('serverless-cd:middleware-auth');

const auth = (orgRoleKeys) => async (req, _res, next) => {
  const { orgId } = req;
  if (!orgId) {
    return next(new NoAuthError('没有获取到团队信息，无法判断操作权限'));
  }
  // TODO: 没有获取到 org
  debug(`orgId: ${orgId}`);
  debug(`orgRoleKeys: ${orgRoleKeys}`);
  const hasPermissions = await authService.checkOrganizationRole(orgId, orgRoleKeys);
  debug(`hasPermissions: ${hasPermissions}`);

  if (hasPermissions) {
    next();
  } else {
    next(new NoPermissionError('没有操作权限'));
  }
};

module.exports = auth;