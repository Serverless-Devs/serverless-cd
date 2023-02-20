const _ = require('lodash');
const { ROLE, ROLE_KEYS, OWNER_ROLE_KEYS } = require('@serverless-cd/config');
const orgModel = require('../models/org.mode');
const applicationModel = require('../models/application.mode');
const userModel = require('../models/user.mode');
const { ValidationError, NoPermissionError, generateOrgIdByUserIdAndOrgName, prisma } = require('../util');

async function getOrgById(orgId = '') {
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

async function listByOrgName(name = '') {
  const { result } = await orgModel.list({ name });

  const names = await Promise.all(
    _.map(result, async ({ user_id: userId }) => {
      const data = await userModel.getUserById(userId);
      return { username: _.get(data, 'username') };
    }),
  );
  return _.merge(result, names);
}

async function createOrg(userId, name, description) {
  if (_.isEmpty(name)) {
    throw new ValidationError('创建团队 name 是必填项');
  }

  const orgId = generateOrgIdByUserIdAndOrgName(userId, name);
  const userData = await orgModel.getOrgById(orgId);
  if (!_.isEmpty(userData)) {
    throw new ValidationError('组织已存在');
  }
  await orgModel.createOrg({ userId, name, description, role: ROLE.OWNER });
}

async function invite(orgName, inviteUserName, role = ROLE.MEMBER) {
  if (_.includes(ROLE_KEYS, role)) {
    throw new NoPermissionError(`权限字段需要是: ${ROLE_KEYS.join('、')}`);
  }
  if (_.includes(OWNER_ROLE_KEYS, role)) {
    throw new NoPermissionError('不能邀请人为最高管理');
  }
  if (_.isEmpty(inviteUserName)) {
    throw new ValidationError('需要填写被邀请用户名');
  }

  const userConfig = await userModel.getUserByName(inviteUserName);
  if (_.isEmpty(userConfig)) {
    throw new ValidationError(`没有找到此用户: ${inviteUserName}`);
  }

  await orgModel.createOrg({ userId: userConfig.id, name: orgName, role });
}

async function updateUserRole(orgName, inviteUserId, role = ROLE.MEMBER) {
  if (_.isEmpty(inviteUserId)) {
    throw new ValidationError('需要填写被操作的用户ID');
  }
  if (_.includes(OWNER_ROLE_KEYS, role)) {
    throw new NoPermissionError('您没有权限设置最高管理权限');
  }

  const inviteUserOrgId = generateOrgIdByUserIdAndOrgName(inviteUserId, orgName);
  const userData = await orgModel.getOrgById(inviteUserOrgId);
  if (_.isEmpty(userData)) {
    throw new ValidationError(`${orgName}团队中没有找到此用户：${userId}`);
  }
  if (_.includes(OWNER_ROLE_KEYS, userData.role)) {
    throw new NoPermissionError(`此用户拥有${orgName}团队最高管理权限，您无法操作`);
  }
  await orgModel.updateOrg(userData.id, { role });
}

async function deleteUser(orgName, inviteUserId) {
  if (_.isEmpty(inviteUserId)) {
    throw new ValidationError('需要被删除用户的ID');
  }
  const inviteUserOrgId = generateOrgIdByUserIdAndOrgName(inviteUserId, orgName);
  return await orgModel.remove(inviteUserOrgId);
}

async function remove(orgId, orgName) {
  await orgModel.deleteMany({ name: orgName });
  await applicationModel.deleteAppByOrgId(orgId);
}

async function transfer(orgId, orgName, transferUserName) {
  if (transferUserName === orgName) {
    throw new ValidationError('注册的团队不能转让');
  }

  const transferUserConfig = await userModel.getUserByName(transferUserName);
  if (_.isEmpty(transferUserConfig)) {
    throw new ValidationError('没有找到此用户');
  }
  // 获取目前团队的数据
  const orgData = await orgModel.getOrgById(orgId);
  // 获取目标用户的数据
  const transferUserId = transferUserConfig.id;
  const transferOrgId = generateOrgIdByUserIdAndOrgName(`${transferUserId}:${orgName}`)
  const transferOrgData = await orgModel.getOrgById(transferOrgId);
  // 组合目标团队的数据
  const payload = {
    name: orgName,
    role: ROLE.OWNER,
    description: _.get(orgData, 'description'),
    secrets: _.get(orgData, 'secrets'),
  }

  if (_.isEmpty(transferOrgData)) {
    _.set(payload, 'userId', transferUserId);
    await applicationModel.updateManyOrgIdOfApp(orgId, transferOrgId);
    await orgModel.createOrg(payload);
    await orgModel.remove(orgId);
  } else {
    _.set(payload, 'user_id', transferUserId);
    await orgModel.updateOrg(transferOrgId, payload);
    await applicationModel.updateManyOrgIdOfApp(orgId, transferOrgId);
    await orgModel.remove(orgId);
  }
}

function desensitization(data) {
  if (_.isArray(data)) {
    return _.map(data, item => _.omit(item, ['secrets']))
  }
  return _.omit(data, ['secrets']);
}

module.exports = {
  desensitization,
  transfer,
  remove,
  deleteUser,
  createOrg,
  updateUserRole,
  invite,
  getOrgById,
  listByUserId,
  listByOrgName,
};
