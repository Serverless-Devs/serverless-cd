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
  async getUserByGithubUid(githubUid) {
    const userInfo = await userPrisma.findFirst({ where: { github_unionid: githubUid } });
    return getUserInfo(userInfo);
  },
  async updateUserById(id, params) {
    await userPrisma.update({
      where: { id },
      data: {
        ...params,
        third_part: JSON.stringify(params.third_part),
      },
    });
  },
  async createUser(data) {
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
