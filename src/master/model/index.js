const _ = require('lodash');
const { TABLE, ROLE } = require('@serverless-cd/config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const applicationPrisma = prisma[TABLE.APPLICATION];
const orgPrisma = prisma[TABLE.ORG];
const userPrisma = prisma[TABLE.USER];

/**
 * 根据 userId 获取用户信息
 * @param {*} id 
 * @returns 
 */
async function getUserById(id) {
  const result = await userPrisma.findUnique({ where: { id } });
  if (result && result.third_part) {
    result.third_part = JSON.parse(result.third_part);
  }
  return result;
}

/**
 * 根据 orgId 获取团队信息
 * @param {*} id 
 * @returns 
 */
async function getOrgById(id) {
  const result = await orgPrisma.findUnique({ where: { id } });
  if (result && result.secrets) {
    result.secrets = JSON.parse(result.secrets);
  }
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
    const ownerOrgData = await orgPrisma.findFirst({ where: { name, role: ROLE.OWNER } });
    ownerUserId = ownerOrgData.user_id;
  }

  // TODO
  // 此团队拥有者的数据：一个团队只能拥有一个 owner
  const userConfig = await getUserById(ownerUserId);
  return {
    ...userConfig,
    secrets: orgData.secrets,
  };
}

/**
 * 通过 appId 获取应用信息
 * @param {*} id 
 * @returns 
 */
async function getAppById(id) {
  const result = await applicationPrisma.findUnique({ where: { id } });
  if (result && result.environment) {
    result.environment = JSON.parse(result.environment)
  }
  return result;
}

module.exports = {
  getAppById,
  getOrganizationOwnerIdByOrgId,
}