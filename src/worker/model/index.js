const httpx = require('httpx');
const _ = require('lodash');
const { DOMAIN } = process.env;

async function httpxRequest(url, jwt_token, method = 'GET', data) {
  console.debug(`request url: ${url}`);
  console.debug(`request method: ${method}`);
  try {
    const response = await httpx.request(url, {
      method,
      headers: {
        'content-type': 'application/json',
        Cookie: `jwt=${jwt_token}`,
      },
      rejectUnauthorized: false,
      timeout: 30000,
      data: data ? JSON.stringify(data) : undefined,
    });
    const result = JSON.parse(await httpx.read(response, 'utf8'));
    console.debug(`result: ${result}, ${typeof result}`);
    return _.get(result, 'data', {});
  } catch (ex) {
    console.debug(`tracker error: ${ex}`)
  }
}

const getTask = async (jwt_token, orgName, appId, id) => {
  const url = `http://${DOMAIN}/api/task/detail?id=${id}&appId=${appId}&orgName=${orgName}`;
  console.debug(`tracker url: ${url}`);
  return await httpxRequest(url, jwt_token);
};

/**
 * 通过 appId 修改应用信息
 * @param {*} id
 * @returns
 */
async function updateAppEnvById(jwt_token, orgName, id, envName, latestTask) {
  let url = `http://${DOMAIN}/api/application/detail?id=${id}&orgName=${orgName}`;
  const result = await httpxRequest(url, jwt_token);
  console.log('???', result);
  if (_.isEmpty(result)) {
    throw new Error(`Not found app with id ${id}`);
  }
  if (latestTask && !latestTask.time) {
    _.set(latestTask, 'time', new Date(latestTask.time));
  }

  _.set(result, `environment.[${envName}].latest_task`, latestTask);
  const data = { id, orgName, environment: result.environment }
  url = `http://${DOMAIN}/api/application/update`;
  return await httpxRequest(url, jwt_token, 'POST', data);
}

/**
 * 
 */
async function makeTask(jwt_token, orgName, appId, id, payload) {
  const url = `http://${DOMAIN}/api/task/exists`;
  const data = { id, payload, orgName, appId }
  return await httpxRequest(url, jwt_token, 'POST', data);
}

module.exports = {
  updateAppEnvById,
  makeTask,
  getTask,
};
