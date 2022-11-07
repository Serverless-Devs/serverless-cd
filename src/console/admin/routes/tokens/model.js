const { OTS_TOKEN } = require('../../config');
const orm = require("../../util/orm")(OTS_TOKEN.name, OTS_TOKEN.index);

// 查询单个TASK数据
async function findOne(id) {
  return orm.findByPrimary([{ id }]);
}
// 创建
async function create(id, params) {
  return orm.create([{ id }], params);
}
// 查询列表
async function find(params = {}) {
  return await orm.find(params);
}
// 修改
async function update(id, params) {
  return orm.update([{ id }], params);
}
// 删除
async function remove(id) {
  return orm.delete([{ id }]);
}

module.exports = {
  findOne,
  create,
  find,
  update,
  remove,
};
