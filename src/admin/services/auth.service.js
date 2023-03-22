const jwt = require('jsonwebtoken');
const debug = require('debug')('serverless-cd:auth');
const _ = require('lodash');
const { JWT_SECRET, ADMIN_ROLE_KEYS, SESSION_EXPIRATION } = require('@serverless-cd/config');
const userModel = require('../models/user.mode');
const orgModel = require('../models/org.mode');
const { md5Encrypt, ValidationError, checkNameAvailable, NoAuthError } = require('../util');

/**
 * 注册用户
 */
async function initUser({ username, password, email }) {
  checkNameAvailable(username);
  const data = await userModel.getUserByName(username);
  if (_.get(data, 'username', '')) {
    throw new ValidationError('用户名已存在');
  }
  const dataEmail = await userModel.getUserByEmail(email);

  if (_.get(dataEmail, 'email', '')) {
    throw new ValidationError('邮箱已存在');
  }
  const orgData = await orgModel.getOwnerOrgByName(username);
  if (_.get(orgData, 'name', '')) {
    throw new ValidationError('团队名称已存在');
  }

  const { id: userId } = await userModel.createUser({ username, password, email });
  const { id: orgId } = await orgModel.createOrg({ userId, name: username });

  return { userId, orgId };
}

/**
 * 通过密码登陆账户
 */
async function loginWithPassword({ loginname, password }) {
  // 通过账户 / 邮箱 登录
  // 通过密码登录
  let data;
  if (loginname.indexOf('@') > -1) {
    data = await userModel.getUserByEmail(loginname);
  } else {
    data = await userModel.getUserByName(loginname);
  }
  if (_.isEmpty(data)) {
    throw new ValidationError(`用户(${loginname})不存在`);
  }
  const isTrue = _.get(data, 'password', '') === md5Encrypt(password);
  if (!isTrue) {
    throw new ValidationError('用户名或密码不正确');
  }

  return data;
}

/**
 * 设置 jwt
 */
async function setJwt({ userId }, res) {
  const SESSION_EXPIRATION_EXP =
    Math.floor(Date.now() / 1000) + Math.floor(SESSION_EXPIRATION / 1000);
  debug(`session expiration expires ${SESSION_EXPIRATION_EXP}`);
  const jwtSign = {
    userId,
    expires: SESSION_EXPIRATION_EXP,
  };
  debug(`setJwt start: ${userId}`);
  const token = await jwt.sign(jwtSign, JWT_SECRET);
  debug(`jwt sign token ${token}`);

  res.cookie('jwt', token, {
    maxAge: SESSION_EXPIRATION,
    httpOnly: true,
  });

  return { expires: SESSION_EXPIRATION_EXP };
}

/**
 * 检测用户是否拥有调用的权限
 */
async function checkOrganizationRole(orgId, orgRoleKeys = ADMIN_ROLE_KEYS) {
  const orgConfig = await orgModel.getOrgById(orgId);
  if (_.isEmpty(orgConfig)) {
    throw new NoAuthError('在此团队没有找到您，没有权限');
  }
  return orgRoleKeys.includes(_.get(orgConfig, 'role'));
}

module.exports = {
  setJwt,
  initUser,
  loginWithPassword,
  checkOrganizationRole,
};
