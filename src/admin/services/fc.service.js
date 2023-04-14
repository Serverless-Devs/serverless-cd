const _ = require('lodash');
const qs = require('qs');
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
      authType: _.get(httpTrigger, 'triggerConfig.authType'),
    });
  }

  return result;
}

async function getSignature (
  client,
  fcContext,
  method,
  path,
  headers,
  nowTime,
  queries,
) {
  const {
    accessKeyId,
    accessKeySecret,
    accountId,
    regionId,
    sts,
    securityToken,
  } = fcContext;
  const buildHeaders = Object.assign(client.headers, headers);
  const endpoint = _.includes(path, 'fcapp.run') ? path : `https://${accountId}.${regionId}.fc.aliyuncs.com${path}`;
  if (sts) {
    buildHeaders["x-fc-security-token"] = securityToken;
  }

  debug(`method ========= ${method}`);
  debug(`path ========= ${path}`);
  debug(`buildHeaders ========= ${JSON.stringify(buildHeaders)}`);
  debug(`queries ========= ${JSON.stringify(queries)}`);

  const signal = await Fc.getSignature(
    accessKeyId,
    accessKeySecret,
    method,
    path,
    buildHeaders,
    queries
  );

  return {
    authoration: signal,
    // accessKeyId,
    accountId,
    endpoint,
    xFcDate: nowTime,
    token: securityToken,
  };
};

async function httpInvoke(orgName, cloudAlias, resource, payload = {}) {
  const { uid, region, service: serviceName, function: functionName, urlInternet, authType = '' } = resource;
  if (_.isEmpty(urlInternet)) {
    throw new ValidationError('缺少参数 urlInternet');
  }
  const { AccountID, AccessKeyID, AccessKeySecret } = await getCloudSecret(orgName, cloudAlias);
  if (uid !== AccountID) {
    debug(`uid 不一致: ${uid} !== ${AccountID}`);
    throw new ValidationError('AccountId 和 关联云账号对应不上');
  }

  const { qualifier, headers = {}, method = 'GET', path = '', host, asyncMode = false } = payload;
  const nowTime = new Date().toUTCString();

  const _path = path && path[0] === '/' ? path : `/${path}`;
  let pathUrl = '';
  if (host) {
    pathUrl = `${host}${_path}`
  } else {
    pathUrl = `/2016-08-15/proxy/${serviceName}.${qualifier ? qualifier : 'LATEST'}/${functionName}${_path}`
  }

  const signaHeaders = {
    ...headers,
    date: nowTime,
    host: host ? host.replace(/https?:\/\//, '') : `${uid}.${region}.fc.aliyuncs.com`,
    "x-fc-date": nowTime,
    "x-fc-account-id": uid,
    "X-Fc-Invocation-Code-Version": "Latest",
    "X-Fc-Log-Type": asyncMode ? 'None' : 'Tail',
  }

  if (asyncMode) {
    signaHeaders['X-Fc-Invocation-Type'] = 'Async';
  }

  let queries = {};

  if (_.includes(path, '?')) {
    const queriesStr = path.substring(path.indexOf('?'), path.length)
    queries = qs.parse(queriesStr, { ignoreQueryPrefix: true })
  }

  const fcClient = Client.generateFc(region, AccountID, AccessKeyID, AccessKeySecret);
  const fcContext = {
    accessKeyId: AccessKeyID,
    accessKeySecret: AccessKeySecret,
    accountId: uid,
    regionId: region,
  };
  return getSignature(fcClient, fcContext, method, pathUrl, signaHeaders, nowTime, queries);
}

async function eventInvoke(orgName, cloudAlias, resource, payload = {}) {
  const { uid, region, service: serviceName, function: functionName } = resource;
  const { AccountID, AccessKeyID, AccessKeySecret } = await getCloudSecret(orgName, cloudAlias);
  if (uid !== AccountID) {
    debug(`uid 不一致: ${uid} !== ${AccountID}`);
    throw new ValidationError('AccountId 和 关联云账号对应不上');
  }

  const fcClient = Client.generateFc(region, AccountID, AccessKeyID, AccessKeySecret);

  const { qualifier } = payload;
  const path = `/2016-08-15/services/${serviceName}.${qualifier ? qualifier : "LATEST"
    }/functions/${functionName}/invocations`;
  const nowTime = new Date().toUTCString();

  const headers = {
    date: nowTime,
    host: `${uid}.${region}.fc.aliyuncs.com`,
    "x-fc-date": nowTime,
    "x-fc-account-id": uid,
    "X-Fc-Invocation-Code-Version": "Latest",
    "X-Fc-Log-Type": "Tail",
    "content-type": "application/octet-stream",
  };

  const fcContext = {
    accessKeyId: AccessKeyID,
    accessKeySecret: AccessKeySecret,
    accountId: uid,
    regionId: region,
  };
  return getSignature(fcClient, fcContext, "POST", path, headers, nowTime, null);
}

module.exports = { detail, eventInvoke, httpInvoke };
