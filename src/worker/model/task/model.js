const Orm = require('@serverless-cd/ots-orm');
const { CREDENTIALS, OTS, OTS_TASK } = require('../../config');

const orm = new Orm({ ...CREDENTIALS, ...OTS }, OTS_TASK.name, OTS_TASK.index);

// 查询单个TASK数据
async function findOne(id) {
  return orm.findByPrimary([{ id }]);
}
// 创建
async function create(id, params) {
  return orm.create([{ id }], params);
}
// 修改
async function update(id, params) {
  return await orm.update([{ id }], params);
}

module.exports = {
  findOne,
  create,
  update,
};
