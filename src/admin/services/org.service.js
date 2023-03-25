const _ = require('lodash');
const debug = require('debug')('serverless-cd:org-service');
const { ROLE, ROLE_KEYS, OWNER_ROLE_KEYS, ADMIN_ROLE_KEYS } = require('@serverless-cd/config');
const git = require('@serverless-cd/git-provider');
const orgModel = require('../models/org.mode');
const applicationModel = require('../models/application.mode');
const userModel = require('../models/user.mode');
const { ValidationError, NoPermissionError, generateOrgIdByUserIdAndOrgName } = require('../util');

async function getProviderToken(orgName, provider) {
  const result = await orgModel.getOwnerOrgByName(orgName);
  const token = _.get(result, `third_part.${provider}.access_token`, '');
  if (!token) {
    throw new ValidationError(`没有找到${provider}.access_token`);
  }
  return token;
}

async function getOrgById(orgId = '') {
  const data = await orgModel.getOrgById(orgId);
  if (_.isEmpty(data)) {
    return {};
  }
  const { role, name } = data;
  if (_.includes(OWNER_ROLE_KEYS, role)) {
    return data;
  }
  const ownerData = await orgModel.getOwnerOrgByName(name);
  _.set(data, 'third_part', ownerData.third_part);
  const secrets = _.get(ownerData, 'secrets', {});
  if (_.includes(ADMIN_ROLE_KEYS, role)) {
    _.set(data, 'secrets', secrets);
  } else {
    _.set(
      data,
      'secrets',
      _.mapValues(secrets, () => ''),
    );
  }

  return data;
}

async function listByUserId(userId = '') {
  if (_.isEmpty(userId)) {
    return {};
  }
  return await orgModel.list({ user_id: userId });
}

async function listByOrgName(orgId, name = '') {
  const { result } = await orgModel.list({ name });

  const ownerData = _.find(result, ({ role }) => role === ROLE.OWNER);
  const { role } = _.find(result, ({ id }) => id === orgId);
  const ownerSecrets = _.get(ownerData, 'secrets', {});
  const secrets = _.includes(ADMIN_ROLE_KEYS, role)
    ? ownerSecrets
    : _.mapValues(ownerSecrets, () => '');

  const names = await Promise.all(
    _.map(result, async ({ user_id: userId }) => {
      const data = await userModel.getUserById(userId);
      return { username: _.get(data, 'username'), secrets };
    }),
  );
  return _.merge(result, names);
}

async function createOrg(userId, body) {
  const { name } = body;
  if (_.isEmpty(name)) {
    throw new ValidationError('创建团队 name 是必填项');
  }

  const orgId = generateOrgIdByUserIdAndOrgName(userId, name);
  const userData = await orgModel.getOrgById(orgId);
  if (!_.isEmpty(userData)) {
    throw new ValidationError('团队已存在');
  }
  await orgModel.createOrg({ ...body, userId, role: ROLE.OWNER });
}

async function invite(orgName, inviteUserName, role = ROLE.MEMBER) {
  if (!_.includes(ROLE_KEYS, role)) {
    throw new NoPermissionError(`权限字段需要是: ${ROLE_KEYS.join('、')}`);
  }
  if (_.includes(OWNER_ROLE_KEYS, role)) {
    throw new NoPermissionError('不能邀请人为最高管理');
  }
  if (_.isEmpty(inviteUserName)) {
    throw new ValidationError('需要填写被邀请用户名');
  }

  const userConfig = await userModel.getUserByName(inviteUserName);
  const { id: userId } = userConfig;
  if (_.isEmpty(userConfig)) {
    throw new ValidationError(`没有找到此用户: ${inviteUserName}`);
  }
  const ownerOrgConfig = await orgModel.getOwnerOrgByName(orgName);
  if (!_.isEmpty(ownerOrgConfig)) {
    throw new ValidationError(`没有找到此团队：${orgName}`);
  }
  const inviteOrgId = generateOrgIdByUserIdAndOrgName(userId, orgName);
  const inviteOrgConfig = await orgModel.getOrgById(inviteOrgId);
  if (!_.isEmpty(inviteOrgConfig)) {
    throw new ValidationError(`用户${inviteUserName}已经在${orgName}团队中存在`);
  }

  await orgModel.createOrg({
    userId,
    role,
    name: orgName,
    description: ownerOrgConfig.description,
    logo: ownerOrgConfig.logo,
    alias: ownerOrgConfig.alias,
  });
}

async function updateUserRole(orgName, inviteUserName, role = ROLE.MEMBER) {
  const userConfig = await userModel.getUserByName(inviteUserName);
  if (_.isEmpty(userConfig)) {
    throw new ValidationError(`没有找到此用户: ${inviteUserName}`);
  }
  const inviteUserId = userConfig.id;
  if (_.isEmpty(inviteUserId)) {
    throw new ValidationError('需要填写被操作的用户ID');
  }
  if (_.includes(OWNER_ROLE_KEYS, role)) {
    throw new NoPermissionError('您没有权限设置最高管理权限');
  }

  const inviteUserOrgId = generateOrgIdByUserIdAndOrgName(inviteUserId, orgName);
  debug(`update user role inviteUserOrgId: ${inviteUserOrgId}`);
  const userData = await orgModel.getOrgById(inviteUserOrgId);
  if (_.isEmpty(userData)) {
    throw new ValidationError(`${orgName}团队中没有找到此用户：${inviteUserId}`);
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
  await applicationModel.deleteAppByOwnerOrgId(orgId);
  // TODO: 删除webhook
}

async function updateOwnerByName(orgName, data) {
  const { id: orgId } = await orgModel.getOwnerOrgByName(orgName);
  await orgModel.updateOrg(orgId, data);
}

async function updateThirdPart(orgName, { token, provider }) {
  const data = await orgModel.getOwnerOrgByName(orgName);
  if (_.isEmpty(token)) {
    _.set(data, `third_part.${provider}`, {});
  } else {
    const providerClient = git(provider, { access_token: token });
    const { login, id, avatar } = await providerClient.user();
    _.set(data, `third_part.${provider}.access_token`, token);
    _.set(data, `third_part.${provider}.owner`, login);
    _.set(data, `third_part.${provider}.id`, id);
    _.set(data, `third_part.${provider}.avatar`, avatar);
  }

  await orgModel.updateOrg(data.id, data);
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
  const transferOrgId = generateOrgIdByUserIdAndOrgName(`${transferUserId}:${orgName}`);
  const transferOrgData = await orgModel.getOrgById(transferOrgId);
  // 组合目标团队的数据
  const payload = {
    name: orgName,
    role: ROLE.OWNER,
    description: _.get(orgData, 'description'),
    secrets: _.get(orgData, 'secrets'),
  };

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
  const filterData = (item) => {
    item.third_part = _.mapValues(_.get(item, 'third_part', {}), (item = {}) => ({
      owner: item.owner,
      id: item.id,
      avatar: item.avatar,
    }));
    return item;
  };

  if (_.isArray(data)) {
    return _.map(data, filterData);
  } else if (_.isPlainObject(data) && data.totalCount) {
    return {
      totalCount: data.totalCount,
      result: _.map(data.result, filterData),
    }
  }
  return filterData(data);
}

async function getOwnerUserByName(orgName) {
  const { user_id } = await orgModel.getOwnerOrgByName(orgName);
  return await userModel.getUserById(user_id);
}

module.exports = {
  updateThirdPart,
  getOwnerUserByName,
  updateOwnerByName,
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
  getProviderToken,
};
