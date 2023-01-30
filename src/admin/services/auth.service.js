const jwt = require('jsonwebtoken');
const debug = require('debug')('serverless-cd:auth');
const _ = require('lodash');
const { JWT_SECRET } = require('../config/env');
const { ROLE, ADMIN_ROLE_KEYS, SESSION_EXPIRATION } = require('../config/constants');
const accountModel = require('../models/account.mode');
const { md5Encrypt, ValidationError } = require('../util');

/**
 * 注册用户
 */
async function initUser({ username, password }) {
  const data = await accountModel.getUserByName(username);
  if (_.get(data, 'username', '')) {
    throw new ValidationError('用户名已存在');
  }

  const { id: userId } = await accountModel.createUser({ username, password });
  const { id: orgId } = await accountModel.createOrg({ userId, name: username });

  return { userId, orgId };
}

/**
 * 通过密码登陆账户
 */
async function loginWithPassword({ username, password }) {
  const data = await accountModel.getUserByName(username);
  const isTrue = _.get(data, 'password', '') === md5Encrypt(password);
  if (!isTrue) {
    throw new ValidationError('用户名或密码不正确');
  }

  const userId = data.id;
  const { id: orgId } = await accountModel.getOrgFirst({ user_id: userId, role: ROLE.OWNER });
  return { userId, orgId };
}

/**
 * 设置 jwt
 */
async function setJwt({ userId, orgId }, res) {
  const SESSION_EXPIRATION_EXP = Math.floor(Date.now() / 1000) + Math.floor(SESSION_EXPIRATION / 1000);
  debug(`session expiration exp ${SESSION_EXPIRATION_EXP}`);
  const jwtSign = {
    userId,
    orgId,
    exp: SESSION_EXPIRATION_EXP,
  };
  debug(`setJwt start: ${userId}, ${orgId}`);
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
  const { role } = await accountModel.getOrgById(orgId);
  return orgRoleKeys.includes(role);
}

module.exports = {
  setJwt,
  initUser,
  loginWithPassword,
  checkOrganizationRole,
};
