const _ = require('lodash');
const { TABLE } = require('@serverless-cd/config');
const { prisma } = require('../util');

const applicationPrisma = prisma[TABLE.APPLICATION];

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

module.exports = {
  async getAppById(id) {
    const result = await applicationPrisma.findUnique({ where: { id } });
    return getAppInfo(result);
  },
  async findFirstApp(where) {
    const application = await applicationPrisma.findFirst({ where });
    return getAppInfo(application);
  },
  async getAppByProvider({ provider, providerRepoId }) {
    const application = await applicationPrisma.findFirst({
      where: {
        provider,
        repo_id: providerRepoId,
      },
    });
    return getAppInfo(application);
  },
  async createApp(data) {
    return await applicationPrisma.create({
      data: {
        ...data,
        environment: JSON.stringify(data.environment),
      },
    });
  },
  async listAppByOwnerOrgId(orgId) {
    const applicationResult = await applicationPrisma.findMany({
      where: {
        owner_org_id: orgId,
      },
      orderBy: {
        updated_time: 'desc',
      },
    });
    return _.map(applicationResult, (item) => getAppInfo(item));
  },
  async deleteAppById(appId) {
    const result = await applicationPrisma.delete({
      where: { id: appId },
    });
    return result;
  },
  async deleteAppByOwnerOrgId(orgId = '') {
    const result = await applicationPrisma.deleteMany({ where: { owner_org_id: orgId } });
    return result;
  },
  async updateAppById(id, data) {
    if (_.isPlainObject(data.environment)) {
      data.environment = JSON.stringify(data.environment);
    }
    _.unset(data, 'id');
    const result = applicationPrisma.update({ where: { id }, data });
    return result;
  },
  async updateManyOrgIdOfApp(sourceOrgId, targetOrgId) {
    await prisma.$transaction([
      applicationPrisma.updateMany({
        where: {
          org_id: sourceOrgId,
        },
        data: {
          org_id: targetOrgId,
        },
      }),
      applicationPrisma.updateMany({
        where: {
          owner_org_id: sourceOrgId,
        },
        data: {
          owner_org_id: targetOrgId,
        },
      }),
    ]);
  },
};
