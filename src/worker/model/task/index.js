const model = require('./model');

async function make(id, params = {}) {
  const dbConfig = await model.findOne(id);
  const attributes = { ...params };
  if (dbConfig.id) {
    const res = await model.update(id, attributes);
    return {
      success: true,
      data: res,
    };
  }
  const res = await model.create(id, attributes);

  return {
    success: true,
    data: res,
  };
}

async function find(id) {
  return await model.findOne(id);
}

module.exports = {
  make,
  find,
}
