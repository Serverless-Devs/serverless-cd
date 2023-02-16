const _ = require('lodash');
const { ROLE, ADMIN_ROLE_KEYS, OWNER_ROLE_KEYS } = require('@serverless-cd/config');
const orgModel = require('../models/org.mode');
const userModel = require('../models/user.mode');
const { ValidationError, NoPermissionError } = require('../util');

async function getOwnerOrgByUserId(userId, orgName) {
  let name = orgName;
  if (_.isEmpty(name)) {
    const userConfig = await userModel.getUserById(userId);
    name = _.get(userConfig, 'username', '');
  }
  return await orgModel.getOrgFirst({ user_id: userId, name });
}

async function getOrgById(orgId = '') {
  if (_.isEmpty(orgId)) {
    return {};
  }
  const data = await orgModel.getOrgById(orgId);
  if (_.isEmpty(data)) {
    return {};
  }
  return data;
}

async function listByUserId(userId = '') {
  if (_.isEmpty(userId)) {
    return {};
  }
  return await orgModel.list({ user_id: userId });
}

async function listByOrgId(orgId = '') {
  if (_.isEmpty(orgId)) {
    return {};
  }
  const data = await orgModel.getOrgById(orgId);
  if (_.isEmpty(data)) {
    throw new ValidationError(`没有找到此团队：${orgId}`);
  }
  return await orgModel.list({ name: data.name });
}

async function createOrg(userId, payload = {}) {
  const { name, description } = payload;
  if (_.isEmpty(name)) {
    throw new ValidationError('创建团队 name 是必填项');
  }
  await orgModel.createOrg({ userId, name: payload.name, description, role: ROLE.OWNER });
}

async function invite(orgId, payload = {}) {
  const { userId } = payload;
  if (_.isEmpty(userId)) {
    throw new ValidationError('需要填写被邀请用户的ID');
  }

  const data = await orgModel.getOrgById(orgId);
  if (_.isEmpty(data)) {
    throw new ValidationError(`没有找到此团队：${orgId}`);
  }
  await orgModel.createOrg({ userId, name: data.name, role: ROLE.MEMBER });
}

async function updateUserRole(orgId, payload = {}) {
  const { userId, role = ROLE.MEMBER } = payload;
  if (_.isEmpty(userId)) {
    throw new ValidationError('需要填写被邀请用户的ID');
  }
  if (_.includes(OWNER_ROLE_KEYS, role)) {
    throw new NoPermissionError('您没有权限设置最高管理权限');
  }

  const data = await orgModel.getOrgById(orgId);
  if (_.isEmpty(data)) {
    throw new ValidationError(`没有找到此团队：${orgId}`);
  }
  const { name, role: editRole } = data;
  // 不是管理员不能操作
  if (!_.includes(ADMIN_ROLE_KEYS, editRole)) {
    throw new NoPermissionError('权限不足，无法操作此团队');
  }

  const userData = await orgModel.getOrgFirst({ user_id: userId, name });
  if (_.isEmpty(userData)) {
    throw new ValidationError(`${name}团队中没有找到用户${userId}`);
  }
  if (_.includes(OWNER_ROLE_KEYS, userData.role)) {
    throw new NoPermissionError(`此用户拥有${name}团队最高管理权限，您无法操作`);
  }
  await orgModel.updateOrg(userData.id, { role });
}

async function deleteUser(orgId, userId) {
  if (_.isEmpty(userId)) {
    throw new ValidationError('需要被删除用户的ID');
  }
  const data = await orgModel.getOrgById(orgId);
  if (_.isEmpty(data.name)) {
    throw new ValidationError(`没有找到此团队：${orgId}`);
  }
  return await orgModel.deleteMany({ user_id: userId, name: data.name });
}

async function remove(orgId = '') {
  const data = await orgModel.getOrgById(orgId);
  if (_.isEmpty(data.name)) {
    throw new ValidationError(`没有找到此团队：${orgId}`);
  }

  return await orgModel.deleteMany({ name: data.name });
}

async function transfer(orgId, transferUserId) {
  const data = await orgModel.getOrgById(orgId);
  if (_.isEmpty(data.name)) {
    throw new ValidationError(`没有找到此团队：${orgId}`);
  }
  const { role, name } = data;
  if (!_.includes(OWNER_ROLE_KEYS, role)) {
    throw new NoPermissionError('您不是最高管理员，无权此操作');
  }
  const userConfig = await userModel.getUserById(userId);
  if (_.get(userConfig, 'username') === name) {
    throw new ValidationError('注册的团队不能转让');
  }

  const userData = await orgModel.getOrgFirst({ user_id: transferUserId, name });
  if (!_.isEmpty(userData)) {
    await orgModel.remove(userData.id);
  }
  await orgModel.updateOrg(orgId, { user_id: transferUserId });
}

function desensitization(data) {
  if (_.isArray(data)) {
    return _.map(data, item => _.omit(item, ['secrets']))
  }
  return _.omit(data, ['secrets']);
}

module.exports = {
  desensitization,
  getOwnerOrgByUserId,
  transfer,
  remove,
  deleteUser,
  createOrg,
  updateUserRole,
  invite,
  getOrgById,
  listByUserId,
  listByOrgId,
};
