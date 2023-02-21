const jwt = require('jsonwebtoken');
const debug = require('debug')('serverless-cd:auth');
const _ = require('lodash');
const { JWT_SECRET, ROLE, ADMIN_ROLE_KEYS, SESSION_EXPIRATION } = require('@serverless-cd/config');
const userModel = require('../models/user.mode');
const orgModel = require('../models/org.mode');
const { md5Encrypt, ValidationError, checkNameAvailable } = require('../util');

/**
 * 注册用户
 */
async function initUser({ username, password }) {
  if (!checkNameAvailable(username)) {
    throw new ValidationError('用户名称不合法，预期格式：/^[a-zA-Z0-9-_]{1,50}$/');
  }
  const data = await userModel.getUserByName(username);
  if (_.get(data, 'username', '')) {
    throw new ValidationError('用户名已存在');
  }
  const orgData = await orgModel.getOrgFirst({ name: username });
  if (_.get(orgData, 'name', '')) {
    throw new ValidationError('团队名称已存在');
  }

  const { id: userId } = await userModel.createUser({ username, password });
  const { id: orgId } = await orgModel.createOrg({ userId, name: username });

  return { userId, orgId };
}

/**
 * 通过密码登陆账户
 */
async function loginWithPassword({ username, password }) {
  const data = await userModel.getUserByName(username);
  const isTrue = _.get(data, 'password', '') === md5Encrypt(password);
  if (!isTrue) {
    throw new ValidationError('用户名或密码不正确');
  }

  const userId = data.id;
  const { id: orgId } = await orgModel.getOrgFirst({ user_id: userId, role: ROLE.OWNER });
  return { userId, orgId };
}

/**
 * 设置 jwt
 */
async function setJwt({ userId }, res) {
  const SESSION_EXPIRATION_EXP = Math.floor(Date.now() / 1000) + Math.floor(SESSION_EXPIRATION / 1000);
  debug(`session expiration exp ${SESSION_EXPIRATION_EXP}`);
  const jwtSign = {
    userId,
    exp: SESSION_EXPIRATION_EXP,
  };
  debug(`setJwt start: ${userId}`);
  const token = await jwt.sign(jwtSign, JWT_SECRET);
  debug(`jwt sign token ${token}`);

  res.cookie('jwt', token, {
    maxAge: SESSION_EXPIRATION,
    httpOnly: true,
  });
}

/**
 * 检测用户是否拥有调用的权限
 */
async function checkOrganizationRole(orgId, orgRoleKeys = ADMIN_ROLE_KEYS) {
  const orgConfig = await orgModel.getOrgById(orgId);
  return orgRoleKeys.includes(_.get(orgConfig, 'role'));
}

module.exports = {
  setJwt,
  initUser,
  loginWithPassword,
  checkOrganizationRole,
};
