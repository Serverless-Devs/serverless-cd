const { NoPermissionError } = require('../util');
const authService = require('../services/auth.service');
const debug = require('debug')('serverless-cd:middleware-auth');

const auth = (orgRoleKeys) => async (req, _res, next) => {
  const { orgId } = req;
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