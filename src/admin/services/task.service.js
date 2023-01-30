const _ = require('lodash');
const debug = require('debug')('serverless-cd:application');
const taskModel = require('../models/task.mode');

const { ValidationError, unionId } = require('../util');

async function list(appId) {
  return await taskModel.listByAppId(appId);
}

module.exports = {
  list,
};