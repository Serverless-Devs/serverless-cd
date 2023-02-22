const _ = require('lodash');
const { ROLE, TABLE } = require('@serverless-cd/config');
const { unionId, md5Encrypt, prisma } = require('../util');

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
  async getUserById(id) {
    const result = await userPrisma.findUnique({ where: { id } });
    return getUserInfo(result);
  },
  async getUserByName(username) {
    const userInfo = await userPrisma.findUnique({ where: { username } });
    return getUserInfo(userInfo);
  },
  async updateUserById(id, data) {
    if (data.third_part) {
      data.third_part = JSON.stringify(data.third_part);
    }
    await userPrisma.update({
      where: { id },
      data,
    });
  },
  async createUser(data) {
    if (data.third_part) {
      data.third_part = JSON.stringify(data.third_part);
    }
    const userId = unionId();
    const result = await userPrisma.create({
      data: {
        id: userId,
        ...data,
        password: data.password ? md5Encrypt(data.password) : '',
      },
    });
    return result;
  },
};
