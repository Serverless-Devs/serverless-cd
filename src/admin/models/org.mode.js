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
  if (result.secrets) {
    result.secrets = JSON.parse(result.secrets);
  }
  return result;
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
  async createOrg({ userId, name, role, description, secrets }) {
    const orgId = generateOrgIdByUserIdAndOrgName(userId, name);
    const result = await orgPrisma.create({
      data: {
        id: orgId,
        user_id: userId,
        name,
        role: role || ROLE.OWNER,
        description,
        secrets: secrets ? JSON.stringify(secrets) : '',
      },
    });
    return result;
  },
  async updateOrg(id, data) {
    if (data.secrets) {
      data.secrets = JSON.stringify(data.secrets);
    }
    const result = await orgPrisma.update({ where: { id }, data });
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
