import _ from "lodash";
import moment from 'moment';
const DATE_TIME_REG = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/;

export function getParams(search = '') {
  let obj = {};
  let arr = search.slice(1).split('&');
  arr.forEach((item) => {
    let newArr = item.split('=');
    obj[newArr[0]] = newArr[1];
  });
  return obj;
}

export const sleep = (time = 1000) => new Promise((resolve) => setTimeout(resolve, time));

export function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
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

  replaceToken(l)

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
    success: (key) => `\u001b[32m${key}\u001b[0m`,
  }
  _.each(_.keys(logKeys), (logKey: string) => {
    const replaceFn = logKeys[logKey];
    const toLowerKey = _.toLower(logKey); // 字符串转为小写
    const toUpperKey = _.toUpper(logKey); // 字符串转为大写
    const capitalizeKey = _.capitalize(toLowerKey); // 字符串首字母转为大写
    replaceStr = replaceAll(replaceStr, toLowerKey, replaceFn(toLowerKey))
    replaceStr = replaceAll(replaceStr, toUpperKey, replaceFn(toUpperKey))
    replaceStr = replaceAll(replaceStr, capitalizeKey, replaceFn(capitalizeKey))
  })

  return replaceStr
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
  return ref
}


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
}


export function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}