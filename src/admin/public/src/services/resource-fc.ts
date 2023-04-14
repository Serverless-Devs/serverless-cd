import { request } from 'ice';
import { unset } from 'lodash';
import { Buffer } from 'buffer';

export const detail = async (body) => {
  return await request.post('/api/resource/fc/status', body);
};

const invoke = async (signData, method, body, headers = {}, asyncMode = false) => {
  const { xFcDate, accountId, authoration, token, endpoint } = signData || {};

  if (token) {
    headers['x-fc-security-token'] = token;
  }
  if (asyncMode) {
    headers['X-Fc-Invocation-Type'] = 'Async';
  }

  const requestParams = {
    url: endpoint,
    method,
    body,
    headers: {
      'x-fc-date': xFcDate,
      'x-fc-account-id': accountId,
      Authorization: authoration,
      'X-Fc-Invocation-Code-Version': 'Latest',
      'X-Fc-Log-Type': asyncMode ? 'None' : 'Tail',
      ...headers,
    },
  };
  // request 会吞掉一些请求导致计算签名失败
  const response = await fetch(endpoint, requestParams);
  const responseBody = await response.text();

  const responseHeaders = {};
  response.headers.forEach((value, name) => {
    responseHeaders[name.toLowerCase()] = value;
  });

  return { body: responseBody, headers: responseHeaders };
};

export const eventInvoke = async ({ cloudAlias, resource, payload = '' }) => {
  const { data } = await request.post('/api/resource/fc/eventInvoke', { cloudAlias, resource });
  return await invoke(data, 'POST', Buffer.from(payload, 'utf8'), { 'content-type': 'application/octet-stream', });
};

export const httpInvoke = async ({ cloudAlias, resource, payload }) => {
  const { asyncMode, headers = {}, method = 'GET', body } = payload || {};
  unset(payload, 'body');
  const { data } = await request.post('/api/resource/fc/httpInvoke', { cloudAlias, resource, payload });
  return await invoke(data, method, body, headers, asyncMode);
};
