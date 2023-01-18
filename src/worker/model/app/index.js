const model = require('./model');

async function update(appId, params = {}) {
  if (!appId) {
    console.log(`Task config incomplete, appId: ${appId}`);
    throw new Error('App config incomplete.');
  }
  const dbConfig = await model.findOne(appId);
  console.log('dbConfig');
  if (!dbConfig.user_id) {
    console.log(`The application table does not exist, appId: ${appId}`);
    return {
      success: false,
      data: createError(400, '应用表不存在'),
    };
  }

  try {
    const res = await model.update(appId, { ...params });
    return {
      success: true,
      data: res,
    };
  } catch (e) {
    console.error('update app task error', e);
  }
}

module.exports = {
  update,
};
