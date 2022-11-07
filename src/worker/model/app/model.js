const Orm = require('@serverless-cd/ots-orm');
const { CREDENTIALS, OTS, OTS_APP } = require('../../config');

const orm = new Orm({ ...CREDENTIALS, ...OTS }, OTS_APP.name, OTS_APP.index);

// 查询单个TASK数据
async function findOne(appId) {
  return orm.findByPrimary([{ id: appId }]);
}

// 修改
async function update(appId, params) {
  return await orm.update([{ id: appId }], params);
}

module.exports = {
  findOne,
  update,
};
