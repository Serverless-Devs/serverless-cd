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

/**
 * 处理 task
 * @param {*} id 
 * @param {*} params 
 * @returns 
 */
async function makeTask(id, data = {}) {
  const result = await taskPrisma.findUnique({ where: { id } });

  if (!_.isEmpty(data.steps)) {
    data.steps = JSON.stringify(data.steps);
  }
  if (_.isPlainObject(data.trigger_payload)) {
    data.trigger_payload = JSON.stringify(data.trigger_payload);
  }

  console.log(`make db: ${JSON.stringify(data)}`);

  if (_.isEmpty(result)) {
    return await taskPrisma.create({
      data: {
        ...data,
        id,
      },
    })
  }

  return await taskPrisma.update({ where: { id }, data })
}

module.exports = {
  updateAppById,
  makeTask,
}