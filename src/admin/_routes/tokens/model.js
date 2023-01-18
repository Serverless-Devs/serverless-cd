const { OTS_TOKEN } = require('../../config/config');
const orm = require('../../util/orm')(OTS_TOKEN.name, OTS_TOKEN.index);
const _ = require('lodash');

// 查询单个TASK数据
async function findOne(id) {
  const result = await orm.findByPrimary([{ id }]);
  result.expire_time = _.toNumber(result.expire_time);
  if (result.active_time) {
    result.active_time = _.toNumber(result.active_time);
  }
  return result;
}
// 创建
async function create(id, params) {
  params.expire_time = _.toString(params.expire_time);
  return orm.create([{ id }], params);
}
// 查询列表
async function find(params = {}) {
  const tokenList = await orm.find(params);
  tokenList.result = _.get(tokenList, 'result', []).map((tokenItem) => ({
    ...tokenItem,
    expire_time: _.toNumber(tokenItem.expire_time),
    active_time: _.toNumber(tokenItem.active_time),
  }));
  return tokenList;
}
// 修改
async function update(id, params) {
  if (params && params.expire_time) {
    params.expire_time = _.toString(params.expire_time);
  }
  if (params && params.active_time) {
    params.active_time = _.toString(params.active_time);
  }
  return await orm.update([{ id }], params);
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
