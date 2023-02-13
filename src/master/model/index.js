const _ = require('lodash');
const { TABLE, ROLE } = require('@serverless-cd/config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const applicationPrisma = prisma[TABLE.APPLICATION];
const orgPrisma = prisma[TABLE.ORG];
const userPrisma = prisma[TABLE.USER];

const getUserInfo = (result) => {
  if (!result) {
    return null;
  }
  if (_.isArray(result)) {
    result = _.first(result);
  }
  result.third_part = _.isString(result.third_part)
    ? JSON.parse(result.third_part)
    : result.third_part;
  return result;
};

const getAppInfo = (result) => {
  if (!result) {
    return null;
  }
  if (_.isArray(result)) {
    result = _.first(result);
  }
  result.environment = _.isString(result.environment)
    ? JSON.parse(result.environment)
    : result.environment;
  return result;
};

/**
 * 根据 userId 获取用户信息
 * @param {*} id 
 * @returns 
 */
async function getUserById(id) {
  const result = await userPrisma.findUnique({ where: { id } });
  return getUserInfo(result);
}

/**
 * 根据 orgId 获取团队信息
 * @param {*} id 
 * @returns 
 */
async function getOrgById(id) {
  const result = await orgPrisma.findUnique({ where: { id } });
  return result;
}

/**
 * 根据条件获取团队的第一条信息
 * @param {*} where 
 * @returns 
 */
async function getOrgFirst(where) {
  const result = await orgPrisma.findFirst({ where });
  return result;
}

/**
 * 根据团队Id拿到拥有者用户数据
 */
async function getOrganizationOwnerIdByOrgId(orgId) {
  let ownerUserId = '';
  // 当前用户在此团队的数据
  const orgData = await getOrgById(orgId);
  const { role, name = '' } = orgData || {};
  if (role === ROLE.OWNER) {
    ownerUserId = orgData.user_id;
  } else {
    const ownerOrgData = await getOrgFirst({ name, role: ROLE.OWNER });
    ownerUserId = ownerOrgData.user_id;
  }

  // 此团队拥有者的数据：一个团队只能拥有一个 owner
  return await getUserById(ownerUserId);
}

/**
 * 通过 appId 获取应用信息
 * @param {*} id 
 * @returns 
 */
async function getAppById(id) {
  const result = await applicationPrisma.findUnique({ where: { id } });
  return getAppInfo(result);
}

module.exports = {
  getAppById,
  getOrganizationOwnerIdByOrgId,
}