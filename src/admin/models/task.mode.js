const _ = require('lodash');
const { TABLE } = require('../config/constants');
const { prisma, getModel } = require('../util');

const taskPrisma = prisma[TABLE.TASK];

const otsModel = {};

const prismaModel = {
  async listByAppId(appId = '') {
    const result = await taskPrisma.findMany({
      where: {
        app_id: appId,
      },
      orderBy: {
        updated_time: 'desc',
      },
    });
    return result;
  },
  async deleteByAppId(appId = '') {
    return await taskPrisma.deleteMany({
      where: {
        app_id: appId,
      },
    })
  },
};

module.exports = getModel(otsModel, prismaModel);
