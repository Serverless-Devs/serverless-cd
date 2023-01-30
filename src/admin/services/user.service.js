const _ = require('lodash');
const accountModel = require('../models/account.mode');

const { ROLE } = require('../config/constants');
const { NoPermissionError, ValidationError } = require('../util');

async function getUserById(userId = '') {
  const data = await accountModel.getUserById(userId);
  if (_.isNil(data)) {
    return {};
  }
  return data;
}

async function updateUserById(userId, data) {
  return await accountModel.updateUserById(userId, data);
}

/**
 * 根据组织Id拿到拥有者用户数据
 */
async function getOrganizationOwnerIdByOrgId(orgId) {
  let ownerUserId = '';
  // 当前用户在此组织的数据
  const orgData = await accountModel.getOrgById(orgId);
  const { role, name = '' } = orgData || {};
  if (role === ROLE.OWNER) {
    ownerUserId = orgData.user_id;
  } else {
    const ownerOrgData = await accountModel.getOrgFirst({ name, role: ROLE.OWNER });
    ownerUserId = ownerOrgData.user_id;
  }

  // 此组织拥有者的数据：一个组织只能拥有一个 owner
  return await getUserById(ownerUserId);
}

/**
 * 根据组织Id获取拥有者用户Token
 */
async function getProviderToken(orgId, userId, provider) {
  const userInfo = await getOrganizationOwnerIdByOrgId(orgId);
  const token = _.get(userInfo, `third_part.${provider}.access_token`, '');
  if (!token) {
    if (_.get(userInfo, 'id', '') === userId) {
      throw new ValidationError(`${provider} 授权令牌不存在，请重新授权`);
    }
    throw new NoPermissionError(`没有找到 ${provider}.access_token`);
  }

  return token;
}

module.exports = {
  getUserById,
  updateUserById,
  getProviderToken,
  getOrganizationOwnerIdByOrgId,
};
