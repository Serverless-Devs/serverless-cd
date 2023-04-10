const _ = require('lodash');
const { ROLE, TABLE } = require('@serverless-cd/config');
const { generateOrgIdByUserIdAndOrgName, prisma } = require('../util');

const orgPrisma = prisma[TABLE.ORG];

const getOrgInfo = (result) => {
  if (!result) {
    return {};
  }
  if (_.isArray(result)) {
    result = _.first(result);
  }
  result.secrets = result.secrets ? JSON.parse(result.secrets) : {};
  if (result.third_part) {
    result.third_part = JSON.parse(result.third_part);
  }
  if (result.cloudSecret) {
    result.cloudSecret = JSON.parse(result.cloudSecret);
  }
  return result;
};

const saveOrg = (data) => {
  if (data.secrets) {
    data.secrets = JSON.stringify(data.secrets);
  }
  if (data.third_part) {
    data.third_part = JSON.stringify(data.third_part);
  }
  if (data.cloudSecret) {
    data.cloudSecret = JSON.stringify(data.cloudSecret);
  }
  _.unset(data, 'id');
  return data;
};

module.exports = {
  async getOwnerOrgByName(name = '') {
    if (!name) {
      return {};
    }
    const result = await orgPrisma.findFirst({ where: { name, role: ROLE.OWNER } });
    return getOrgInfo(result);
  },
  async getOrgById(id = '') {
    const result = await orgPrisma.findUnique({ where: { id } });
    return getOrgInfo(result);
  },
  async createOrg({ userId, name, role, description, secrets, alias, logo }) {
    const orgId = generateOrgIdByUserIdAndOrgName(userId, name);
    const data = {
      id: orgId,
      user_id: userId,
      role: role || ROLE.OWNER,
      name,
      description,
      secrets,
      alias,
      logo,
    };
    const result = await orgPrisma.create({ data: { id: orgId, ...saveOrg(data), } });
    return result;
  },
  async updateOrg(id, data) {
    const result = await orgPrisma.update({ where: { id }, data: saveOrg(data) });
    return result;
  },
  async remove(id) {
    return await orgPrisma.delete({ where: { id } });
  },
  async deleteMany(where = {}) {
    const result = await orgPrisma.deleteMany({ where });
    return result;
  },
  async list(where, option = {}) {
    // where .eg: { user_id: userId }
    const [totalCount, result] = await prisma.$transaction([
      orgPrisma.count({ where }),
      orgPrisma.findMany({
        ...option,
        where,
      }),
    ]);
    return { totalCount, result: _.map(result, (r) => getOrgInfo(r)) };
  },
};
