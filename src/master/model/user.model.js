const { TABLE } = require('@serverless-cd/config');
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


module.exports = {
  async getUserById(id = '') {
    const result = await userPrisma.findUnique({ where: { id } });
    return getUserInfo(result);
  },
};
