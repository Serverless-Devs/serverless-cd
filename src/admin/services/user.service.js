const _ = require('lodash');
const userModel = require('../models/user.mode');
const orgModel = require('../models/org.mode');

const { ROLE } = require('@serverless-cd/config');
const { NoPermissionError, ValidationError } = require('../util');

async function getUserById(userId = '') {
  const data = await userModel.getUserById(userId);
  if (_.isNil(data)) {
    return {};
  }
  return data;
}

async function updateUserById(userId, data) {
  return await userModel.updateUserById(userId, data);
}

async function fuzzyQueriesByName(containsName) {
  return await userModel.fuzzyQueriesByName(containsName);
}

/**
 * 根据团队Id拿到拥有者用户数据
 */
async function getOrganizationOwnerIdByOrgId(orgId) {
  let ownerUserId = '';
  // 当前用户在此团队的数据
  const orgData = await orgModel.getOrgById(orgId);
  const { role, name = '' } = orgData || {};
  if (role === ROLE.OWNER) {
    ownerUserId = orgData.user_id;
  } else {
    const ownerOrgData = await orgModel.getOwnerOrgByName(name);
    ownerUserId = ownerOrgData.user_id;
  }

  // 此团队拥有者的数据：一个团队只能拥有一个 owner
  return await getUserById(ownerUserId);
}

function desensitization(data) {
  const filterData = (item) => {
    return _.omit(item, ['password', 'secrets']);
  };

  if (_.isArray(data)) {
    return _.map(data, (item) => filterData(item));
  }

  return filterData(data);
}

module.exports = {
  fuzzyQueriesByName,
  desensitization,
  getUserById,
  updateUserById,
  getOrganizationOwnerIdByOrgId,
};
