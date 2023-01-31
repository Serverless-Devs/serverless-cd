const { TABLE } = require('@serverless-cd/config');
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
};
