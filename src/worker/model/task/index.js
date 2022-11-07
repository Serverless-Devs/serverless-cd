const model = require('./model');
const createError = require('http-errors');

async function create(id, params = {}) {
  const dbConfig = await model.findOne(id);
  if (dbConfig.id) {
    return {
      success: false,
      data: createError(400, 'task已存在，请勿重复添加'),
    };
  }
  // 创建 ots
  const attributes = { ...params };

  const res = await model.create(id, attributes);
  return {
    success: true,
    data: res,
  };
}

async function update(id, params = {}) {
  const dbConfig = await model.findOne(id);
  if (!dbConfig.id) {
    return {
      success: false,
      data: createError(400, 'task不存在'),
    };
  }

  const attributes = {
    ...params,
  };
  const res = await model.update(id, attributes);
  return {
    success: true,
    data: res,
  };
}

module.exports = {
  create,
  update,
}
