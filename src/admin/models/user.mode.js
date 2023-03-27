const _ = require('lodash');
const { ROLE, TABLE } = require('@serverless-cd/config');
const { unionId, md5Encrypt, prisma } = require('../util');
const { param } = require('../routers/auth');

const userPrisma = prisma[TABLE.USER];

const getUserInfo = (result) => {
  return result;
};

module.exports = {
  async fuzzyQueriesByName(containsName = '') {
    if (_.isEmpty(containsName)) {
      return [];
    }
    const result = await userPrisma.findMany({
      where: {
        username: { contains: containsName },
      },
    });
    return getUserInfo(result);
  },
  async getUserById(id) {
    const result = await userPrisma.findUnique({ where: { id } });
    return getUserInfo(result);
  },
  async getUserByName(username) {
    const userInfo = await userPrisma.findUnique({ where: { username } });
    return getUserInfo(userInfo);
  },
  async getUserByEmail(email) {
    const userInfo = await userPrisma.findUnique({ where: { email } });
    return getUserInfo(userInfo);
  },
  async getGithubById(github_unionid) {
    const userInfo = await userPrisma.findFirst({ where: { github_unionid: `${github_unionid}` } });
    return getUserInfo(userInfo);
  },
  async getGiteeById(gitee_unionid) {
    const userInfo = await userPrisma.findFirst({ where: { gitee_unionid: `${gitee_unionid}` } });
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
  async updateUser(data) {
    const { username, email, github_unionid, gitee_unionid, new_password } = data;
    if (data.third_part) {
      data.third_part = JSON.stringify(data.third_part);
    }
    const userIdentify = username ? { username } : { email }
    const params = github_unionid ? { ...userIdentify, github_unionid } : { ...userIdentify, gitee_unionid }
    const password = new_password ? new_password : data.password;
    const result = await userPrisma.update({
      where: {
        ...userIdentify,
      },
      data: {
        ...params,
        password: password ? md5Encrypt(password) : '',
      },
    });
    return result;
  },
};
