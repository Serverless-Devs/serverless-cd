const _ = require('lodash');
const { TABLE, DATABASE_URL } = require('@serverless-cd/config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    }
  }
});
const applicationPrisma = prisma[TABLE.APPLICATION];
const taskPrisma = prisma[TABLE.TASK];

const makeSetTaskData = (data) => {
  if (_.isArray(data.steps)) {
    data.steps = JSON.stringify(data.steps);
  }
  if (_.isPlainObject(data.trigger_payload)) {
    data.trigger_payload = JSON.stringify(data.trigger_payload);
  }
  return data;
}
const getTaskInfo = (result) => {
  if (!result) {
    return {};
  }
  if (_.isArray(result)) {
    result = _.first(result);
  }

  if (_.isString(result.steps)) {
    _.set(result, 'steps', JSON.parse(result.steps));
  }
  if (_.isString(result.trigger_payload)) {
    _.set(result, 'trigger_payload', JSON.parse(result.trigger_payload));
  }

  return result;
};

/**
 * 通过 appId 修改应用信息
 * @param {*} id 
 * @returns 
 */
async function updateAppById(id, data) {
  const result = await applicationPrisma.findUnique({ where: { id } });
  if (_.isEmpty(result)) {
    throw new Error(`Not found app with id ${id}`);
  }

  if (_.isPlainObject(data.environment)) {
    data.environment = JSON.stringify(data.environment);
  }
  return applicationPrisma.update({ where: { id }, data });
}


async function getTask(id) {
  const result = await taskPrisma.findUnique({ where: { id } });;
  return getTaskInfo(result);
}

async function createTask(data) {
  return await taskPrisma.create({ data: makeSetTaskData(data) });
}

async function updateTask(id, data) {
  return await taskPrisma.update({ where: { id }, data: makeSetTaskData(data) });
}

/**
 * 处理 task
 * @param {*} id 
 * @param {*} params 
 * @returns 
 */
async function makeTask(id, data = {}) {
  const result = await getTask(id);
  if (_.isEmpty(result)) {
    return await createTask({
      ...data,
      id,
    })
  }

  return await updateTask(id, data);
}

module.exports = {
  updateAppById,
  makeTask,
  getTask,
}