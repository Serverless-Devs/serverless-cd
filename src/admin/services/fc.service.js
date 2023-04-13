const _ = require('lodash');
const debug = require('debug')('serverless-cd:resource');
const Fc = require('@serverless-cd/srm-aliyun-fc2');
const orgModel = require('../models/org.mode');
const { Client, ValidationError } = require('../util');

async function getCloudSecret(orgName, cloudAlias) {
  debug(`关联的云账号: ${cloudAlias}`);
  const ownerOrgData = await orgModel.getOwnerOrgByName(orgName);
  const cloudSecret = _.get(ownerOrgData, `cloud_secret.${cloudAlias}`, {});
  if (_.isEmpty(cloudSecret)) {
    throw new ValidationError(`关联的云账号 ${cloudAlias} 在 ${orgName} 没有配置`);
  }
  const { AccountID, AccessKeyID, AccessKeySecret, provider } = cloudSecret;
  debug(`关联的云账号厂商: ${provider}`);
  if (!(AccountID || AccessKeyID || AccessKeySecret)) {
    throw new ValidationError(`云账号${cloudAlias}存在字段为空，请重新配置`);
  }
  return cloudSecret;
}

async function getFunction(fcClient, serviceName, functionName) {
  const { data } = await fcClient.getFunction(serviceName, functionName);
  return data;
}

async function getHttpTrigger(fcClient, serviceName, functionName) {
  const { data } = await fcClient.listTriggers(serviceName, functionName);
  debug(`get ${serviceName}/${functionName} listTriggers: ${JSON.stringify(data)}`);
  const httpTrigger = data.triggers.filter((t) => t.triggerType === 'http' || t.triggerType === 'https');
  if (_.isEmpty(httpTrigger)) {
    return {};
  }
  const assignQualifierHttpTrigger = _.find(httpTrigger, h => !h.qualifier || h.qualifier?.toLocaleLowerCase() === 'latest');
  if (_.isEmpty(assignQualifierHttpTrigger)) {
    debug(`Your function has an HTTP trigger, but no trigger is configured for the 'LATEST'.`);
    return {};
  }
  return assignQualifierHttpTrigger;
}

async function detail(orgName, cloudAlias, payload) {
  if (!_.isArray(payload)) {
    return payload;
  }
  const { AccountID, AccessKeyID, AccessKeySecret } = await getCloudSecret(orgName, cloudAlias);

  const result = [];

  for (const resource of payload) {
    const { uid, region, service: serviceName, function: functionName } = resource;
    // uid 不一致，即便处理也是失败的，所以提前处理
    if (uid !== AccountID) {
      debug(`uid 不一致: ${uid} !== ${AccountID}`);
      result.push({ ...resource, notFount: true, message: 'AccountId 和 关联云账号对应不上' });
      continue;
    }
    // 每个资源的 region 可能不一致，所以提前准备
    const fcClient = Client.generateFc(region, AccountID, AccessKeyID, AccessKeySecret);
    try {
      await getFunction(fcClient, serviceName, functionName);
    } catch (ex) {
      result.push({ ...resource, notFount: true, message: ex.message });
      continue;
    }
    const httpTrigger = await getHttpTrigger(fcClient, serviceName, functionName);
    debug(`httpTrigger : ${JSON.stringify(httpTrigger)}`);
    result.push({
      ...resource,
      isHttp: !_.isEmpty(httpTrigger),
      urlInternet: httpTrigger.urlInternet,
    });
  }

  return result;
}

async function httpInvoke(orgName, cloudAlias, resource, parames, payload = {}) {
  const { uid, region, urlInternet } = resource;
  const method = _.get(payload, 'method', 'get');
  if (_.isEmpty(urlInternet)) {
    throw new ValidationError('缺少参数 urlInternet');
  }
  const { AccountID, AccessKeyID, AccessKeySecret } = await getCloudSecret(orgName, cloudAlias);
  if (uid !== AccountID) {
    debug(`uid 不一致: ${uid} !== ${AccountID}`);
    throw new ValidationError('AccountId 和 关联云账号对应不上');
  }

  const fcClient = Client.generateFc(region, AccountID, AccessKeyID, AccessKeySecret);

  let customPath = _.get(payload, 'path', '/');
  if (!_.startsWith(customPath, '/')) {
    customPath = `/${customPath}`
  }
  _.unset(payload, 'path'); 

  const headers = Object.assign(fcClient.buildHeaders(), fcClient.headers, _.get(payload, 'headers', {}));
  const statefulAsyncInvocationId = _.get(parames, 'statefulAsyncInvocationId', '');
  if (!_.get(headers, 'X-Fc-Stateful-Async-Invocation-Id')) {
    _.set(headers, 'X-Fc-Stateful-Async-Invocation-Id', statefulAsyncInvocationId);
  }
  _.set(headers, 'X-Fc-Invocation-Type', _.get(parames, 'invocationType', 'sync'));
  _.unset(headers, 'host'); // 携带 host 会导致请求失败

  const isAsync = _.get(payload, 'headers[X-Fc-Invocation-Type]', '').toLocaleLowerCase() === 'async';
  _.set(payload, 'headers[X-Fc-Log-Type]', isAsync ? 'None' : 'Tail');

  if (_.get(httpTrigger, '0.triggerConfig.authType')?.toLocaleLowerCase() !== 'anonymous') {
    debug('invoke http function');
    headers['authorization'] = Fc.getSignature(AccessKeyID, AccessKeySecret, method, customPath, headers, {});
  }
  
  const axiosPayload = {
    ..._.mergeWith(jsonEvent, { headers }),
    url: `${urlInternet}${customPath}`,
    method,
  };
  debug(` ${JSON.stringify(axiosPayload)}`);
  const result = await axios(axiosPayload);
  console.log(result);

  return result;
}

async function eventInvoke(orgName, cloudAlias, resource, event) {
  const { uid, region, service: serviceName, function: functionName } = resource;
  const { AccountID, AccessKeyID, AccessKeySecret } = await getCloudSecret(orgName, cloudAlias);
  if (uid !== AccountID) {
    debug(`uid 不一致: ${uid} !== ${AccountID}`);
    throw new ValidationError('AccountId 和 关联云账号对应不上');
  }

  const fcClient = Client.generateFc(region, AccountID, AccessKeyID, AccessKeySecret);

  let rs;
  try {
    rs = await fcClient.invokeFunction(
      serviceName,
      functionName,
      event,
      {
        'X-Fc-Log-Type': 'Tail',
        'X-Fc-Invocation-Code-Version': 'Latest',
      },
    )
  } catch (ex) {
    debug(`调用失败：${ex}`);
    rs = { error: ex };
  }
  return rs;
}

module.exports = { detail, eventInvoke, httpInvoke };
