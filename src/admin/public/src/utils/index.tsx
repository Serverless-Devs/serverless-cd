import _ from 'lodash';
import store from '@/store';
import { ROLE } from '@/constants';

import moment from 'moment';
const DATE_TIME_REG = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/;

export const formatTime = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => moment(date).format(fmt);

export function getParams(search = '') {
  let obj = {};
  let arr = search.slice(1).split('&');
  arr.forEach((item) => {
    let newArr = item.split('=');
    obj[newArr[0]] = newArr[1];
  });
  return obj;
}

export function getParam(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const result: any = window.location.search.substr(1).match(reg);
  if (!_.isEmpty(result)) {
    return decodeURI(result[2]);
  }
}

export const sleep = (time = 1000) => new Promise((resolve) => setTimeout(resolve, time));

export function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

/**
 * 获取配置
 */
export function getConsoleConfig(key: string, defaultValue?: any) {
  return _.get(window, `CONFIG.${key}`, defaultValue);
}

/**
 * 日志关键字高亮处理
 * @param logs
 * @param requestId
 * @returns
 */
export function formatLogs(log, requestId = '') {
  let l = log;
  if (requestId) {
    l = replaceAll(l, requestId, `\u001b[1;36m${requestId}\u001b[0m`);
  }
  let tokens = l.split(' ');
  let timeToken = tokens[0];
  if (tokens.length && DATE_TIME_REG.test(timeToken)) {
    const dateStr = moment(timeToken).format('YYYY-MM-DD');
    timeToken = timeToken.substring(0, timeToken.indexOf('Z') + 1);
    tokens[0] = `\u001b[1;32m${dateStr === 'Invalid date' ? timeToken : dateStr}\u001b[0m`;
  }

  if (tokens[2] === '[silly]') {
    tokens.splice(2, 1);
  }
  l = tokens.join(' ');

  replaceToken(l);

  return replaceToken(l);
}

/**
 * @param replaceStr
 * @returns
 */
export function replaceToken(replaceStr) {
  const logKeys = {
    warn: (key) => `\u001b[33m${key}\u001b[0m`,
    info: (key) => `\u001b[32m${key}\u001b[0m`,
    error: (key) => `\u001b[31m${key}\u001b[0m`,
    'npm ERR!': (key) => `\u001b[31m${key}\u001b[0m`,
    success: (key) => `\u001b[32m${key}\u001b[0m`,
  };
  _.each(_.keys(logKeys), (logKey: string) => {
    const replaceFn = logKeys[logKey];
    const toLowerKey = _.toLower(logKey); // 字符串转为小写
    const toUpperKey = _.toUpper(logKey); // 字符串转为大写
    const capitalizeKey = _.capitalize(toLowerKey); // 字符串首字母转为大写
    replaceStr = replaceAll(replaceStr, toLowerKey, replaceFn(toLowerKey));
    replaceStr = replaceAll(replaceStr, toUpperKey, replaceFn(toUpperKey));
    replaceStr = replaceAll(replaceStr, capitalizeKey, replaceFn(capitalizeKey));
  });

  return replaceStr;
}

/**
 * 解析部署分支字段 （ref）
 * refs/tags/xxx
 * @param {string} ref
 */
export const formatTag = (ref) => {
  const matchRef = ref.match(/refs\/tags\/(.+)/);
  if (matchRef) {
    return matchRef[1];
  }
  return ref;
};

/**
 * 解析部署分支字段 （ref）
 * refs/heads/${item.branch}
 * body.ref in ["refs/heads/${item.branch}"]
 * @param {string} ref
 */
export const formatBranch = (ref) => {
  const matchBodyRef = ref.match(/body\.ref in \[\"refs\/heads\/(.+)\"\]/);
  if (matchBodyRef) {
    return matchBodyRef[1];
  }

  const matchRef = ref.match(/refs\/heads\/(.+)/);
  if (matchRef) {
    return matchRef[1];
  }

  return ref;
};

export function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function setSearchParams(params) {
  const out = new URL(window.location.href);
  Object.keys(params).forEach((key) => {
    out.searchParams.set(key, String(params[key]));
  });
  const url = out.toString();

  if (url !== window.location.href && window.history.pushState) {
    window.history.pushState({ path: url }, '', url);
  }
}

export function localStorageGet(key) {
  try {
    const value = localStorage.getItem(key);
    if (value && isJson(value)) {
      return JSON.parse(value);
    }
    return value;
  } catch (error) {}
}

export function localStorageSet(key, value) {
  try {
    const newValue = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(key, newValue);
  } catch (error) {}
}

export function localStorageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {}
}

export const stopPropagation = async (e) => {
  e.stopPropagation();
  e.preventDefault();
};

export const isAdmin = (orgName?: string) => {
  const [userState] = store.useModel('user');
  if (_.isEmpty(userState)) return false;
  const id = _.get(userState, 'userInfo.id');
  let newOrgName = orgName || localStorageGet(id);
  const listOrgs = _.get(userState, 'userInfo.listOrgs.result', []);
  const obj: any = _.find(listOrgs, (item: any) => item.name === newOrgName);
  if (_.isEmpty(obj)) return false;
  return obj.role === ROLE.OWNER || obj.role === ROLE.ADMIN;
};

export const getLocalOrgName = () => {
  const [userState] = store.useModel('user');
  if (_.isEmpty(userState)) return;
  const id = _.get(userState, 'userInfo.id');
  return localStorageGet(id);
};
