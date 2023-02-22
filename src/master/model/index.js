const _ = require('lodash');
const { TABLE } = require('@serverless-cd/config');
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
 * 根据团队Id拿到拥有者用户数据
 */
async function getOrganizationOwnerIdByOrgId(orgId) {
  const ownerOrgData = await orgPrisma.findUnique({ where: { id: orgId } });
  if (_.isEmpty(ownerOrgData)) {
    throw new Error('没有找到团队信息');
  }
  const userConfig = await getUserById(ownerOrgData.user_id);
  if (_.isEmpty(userConfig)) {
    throw new Error('没有找到用户信息');
  }
  return {
    ...userConfig,
    secrets: ownerOrgData.secrets,
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