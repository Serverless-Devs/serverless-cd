const Orm = require('@serverless-cd/ots-orm');
const { CREDENTIALS, OTS, OTS_USER } = require('../config');

const orm = new Orm({ ...CREDENTIALS, ...OTS }, OTS_USER.name, OTS_USER.index);

async function findOne(id) {
  return orm.findByPrimary([{ id }]);
}

module.exports = {
  findOne,
};