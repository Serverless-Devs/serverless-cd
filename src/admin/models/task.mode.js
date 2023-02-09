const _ = require('lodash');
const { TABLE } = require('@serverless-cd/config');
const { prisma } = require('../util');

const taskPrisma = prisma[TABLE.TASK];

const getTaskInfo = (result) => {
  if (!result) {
    return {};
  }
  if (_.isArray(result)) {
    result = _.first(result);
  }

  if (_.isString(result.steps)) {
    _.set(result, 'steps', JSON.parse(result.steps));
  }
  if (_.isString(result.trigger_payload)) {
    _.set(result, 'trigger_payload', JSON.parse(result.trigger_payload));
  }

  return result;
};

module.exports = {
  async getTaskById(id) {
    const result = await taskPrisma.findUnique({ where: { id } });;
    return getTaskInfo(result);
  },
  async list(where, option = {}) {
    const [totalCount, result] = await prisma.$transaction([
      taskPrisma.count({ where }),
      taskPrisma.findMany({
        ...option,
        where,
        orderBy: {
          updated_time: 'desc',
        },
      }),
    ]);
    return { totalCount, result: _.map(result, getTaskInfo) };
  },
  async deleteById(id = '') {
    return await taskPrisma.delete({
      where: { id },
    })
  },
  async deleteByAppIdAndEnvName(appId = '', envName = '') {
    return await taskPrisma.deleteMany({
      where: {
        app_id: appId,
        env_name: envName,
      },
    })
  },
  async deleteByAppId(appId = '') {
    return await taskPrisma.deleteMany({
      where: {
        app_id: appId,
      },
    })
  },
};;
