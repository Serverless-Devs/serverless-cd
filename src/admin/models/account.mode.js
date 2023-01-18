const _ = require('lodash');
const { ROLE, TABLE } = require('../config/constants');
const { unionid, md5Encrypt, prisma, getModel } = require('../util');
const userOrm = require('../util/orm')(TABLE.USER);
const orgOrm = require('../util/orm')(TABLE.ORG);

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

const otsModel = {
  async getOrgById(id) {
    const result = await userOrm.findByPrimary([{ id }]);
    return result;
  },
  async getUserById(id) {
    const result = await userOrm.findByPrimary([{ id }]);
    return getUserInfo(result);
  },
  async getUserByName(username) {
    const result = await userOrm.findAllWithPk(['id']);
    const userInfo = _.find(result, (item) => item.username === username);
    return getUserInfo(userInfo);
  },
  async getUserByGithubUid(githubUid) {
    const result = await userOrm.findAllWithPk(['id']);
    const userInfo = _.find(result, (item) => item.github_unionid === githubUid);
    return getUserInfo(userInfo);
  },
  async updateUserById(id, params) {
    await userOrm.update([{ id }], { ...params, third_part: JSON.stringify(params.third_part) });
  },
  async createUser(data) {
    const userId = unionid();
    const result = await userOrm.create([{ id: userId }], {
      ...data,
      password: data.password ? md5Encrypt(data.password) : '',
    });
    await this.createOrg({ userId });
    return result;
  },
  async createOrg({ userId, role }) {
    const orgId = unionid();
    const result = await orgOrm.create([{ id: orgId }], {
      user_id: userId,
      role: role || ROLE.OWNER,
    });
    return result;
  },
};

const prismaModel = {
  async getOrgById(id) {
    const result = await prisma.org.findUnique({ where: { id } });
    return result;
  },
  async getUserById(id) {
    const result = await prisma.user.findUnique({ where: { id } });
    return getUserInfo(result);
  },
  async getUserByName(username) {
    const userInfo = await prisma.user.findUnique({ where: { username } });
    return getUserInfo(userInfo);
  },
  async getUserByGithubUid(githubUid) {
    const userInfo = await prisma.user.findFirst({ where: { github_unionid: githubUid } });
    return getUserInfo(userInfo);
  },
  async updateUserById(id, params) {
    await prisma.user.update({
      where: { id },
      data: {
        ...params,
        third_part: JSON.stringify(params.third_part),
      },
    });
  },
  async createUser(data) {
    const userId = unionid();
    const result = await prisma.user.create({
      data: {
        id: userId,
        ...data,
        password: data.password ? md5Encrypt(data.password) : '',
      },
    });
    await this.createOrg({ userId, name: data.username });
    return result;
  },
  async createOrg({ userId, name, role }) {
    const orgId = unionid();
    const result = await prisma.org.create({
      data: {
        id: orgId,
        user_id: userId,
        name,
        role: role || ROLE.OWNER,
      },
    });
    return result;
  },
};

module.exports = getModel(otsModel, prismaModel);
