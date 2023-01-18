const Orm = require('@serverless-cd/ots-orm');
const { CREDENTIALS, OTS, OTS_APPLICATION } = require('../config');

const orm = new Orm({ ...CREDENTIALS, ...OTS }, OTS_APPLICATION.name, OTS_APPLICATION.index);

// 查询列表
async function find(params = {}) {
  return await orm.find(params);
}

module.exports = {
  find,
};
