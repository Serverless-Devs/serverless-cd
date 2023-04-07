const _ = require('lodash');
const debug = require('debug')('serverless-cd:application');
const taskModel = require('../models/task.mode');

const { ValidationError, formatBranch } = require('../util');

/**
 * 获取 task 列表
 * @param {{ appId: 应用ID; envName?: 环境名称; triggerTypes?: Array<'tracker' | 'console' | 'webhook'> }} param0
 * currentPage  pageSize
 * @returns
 */
async function list({ appId, envName, pageSize, currentPage, taskId, triggerTypes } = {}) {
  if (_.isEmpty(appId)) {
    throw new ValidationError('appId is required');
  }

  const where = { app_id: appId };
  if (!_.isEmpty(envName)) {
    _.set(where, 'env_name', envName);
  }
  if (!_.isEmpty(taskId)) {
    _.set(where, 'id', { equals: taskId });
  }
  const setOr = [];
  if (!_.isEmpty(triggerTypes)) {
    if (triggerTypes.includes('local')) {
      setOr.push({
        trigger_type: { startsWith: 'tracker:' },
      });
    }

    const consoleKeys = ['manual', 'redeploy', 'rollback'];
    const webhookKeys = ['github', 'gitee', 'codeup', 'gitlab'];
    const setIn = [];
    _.forEach(triggerTypes, (type) => {
      if (type === 'console') {
        return setIn.push(...consoleKeys);
      }
      if (type === 'webhook') {
        return setIn.push(...webhookKeys);
      }
    });
    if (!_.isEmpty(setIn)) {
      setOr.push({ trigger_type: { in: setIn } });
    }
  }
  if (!_.isEmpty(setOr)) {
    _.set(where, 'OR', setOr);
  }

  const option = {};
  const take = Number(pageSize || '10'); // 如果分页 默认为10条
  if (!_.isEmpty(currentPage)) {
    // skip?: 查询跳过前 n 个
    _.set(option, 'skip', (Number(currentPage) - 1) * take);
    _.set(option, 'take', take);
  }
  if (!_.isEmpty(pageSize)) {
    // take?: 指定在列表中应该返回多少个对象;
    //   从列表的开头（正值）或结尾（负值）获取，或者从 cursor 位置
    _.set(option, 'take', take);
  }
  // if (!_.isEmpty(cursor)) {
  //   // cursor?: 指定列表开始的位置（该值通常指定一个 id 或其他唯一值）
  //   _.set(option, 'cursor', cursor);
  // }

  debug(`list task db option: ${JSON.stringify(option)}`);
  debug(`list task db where: ${JSON.stringify(where)}`);

  return await taskModel.list(where, option);
}

async function detail(id) {
  return await taskModel.getTaskById(id);
}

async function remove(id) {
  if (_.isEmpty(id)) {
    throw new ValidationError('TaskId is empty');
  }
  return await taskModel.deleteById(id);
}

const getTaskConfig = (taskConfig) => {
  const result = _.omit(taskConfig, 'trigger_payload');

  result.message = _.get(taskConfig, 'trigger_payload.message');
  result.commit = _.get(taskConfig, 'trigger_payload.commit');
  result.ref = _.get(taskConfig, 'trigger_payload.ref');
  result.repo_owner = _.get(taskConfig, 'trigger_payload.authorization.repo_owner');
  result.branch = formatBranch(result.ref);

  return result;
};

module.exports = {
  getTaskConfig,
  detail,
  list,
  remove,
};
