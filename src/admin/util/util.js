const crypto = require('crypto');
const { lodash: _ } = require('@serverless-cd/core');
const { customAlphabet } = require('nanoid');
const { UID_TOKEN, UID_TOKEN_UPPERCASE, WEBHOOK_URL } = require('@serverless-cd/config');
const { ValidationError } = require('./custom-errors');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * unless middleware
 * @param pred
 * @param middleware
 * @returns {(function(*, *, *): void)|*}
 */
function unless(pred, middleware) {
  return (req, res, next) => {
    if (pred(req)) {
      next();
    } else {
      middleware(req, res, next);
    }
  };
}

/**
 * 异步重试一次
 * @param promiseFun
 * @param timer
 * @returns {Promise<*>}
 */
async function retryOnce(promiseFun, timer = 500) {
  try {
    return await promiseFun;
  } catch (error) {
    sleep(timer);
    return await promiseFun;
  }
}

/**
 * 解析部署分支字段 （ref）
 * "refs/heads/xxx"
 * "refs/tags/xxx"
 * @param {string} ref
 */
const formatBranch = (ref = '') => {
  const tagsForma = 'refs/tags/';
  const headsForma = 'refs/heads/';
  if (ref.includes(tagsForma)) {
    return ref.slice(10);
  } else if (ref.includes(headsForma)) {
    return ref.slice(11);
  }
  return ref;
};

/**
 * MD5 加密
 */
const md5Encrypt = (data) => {
  const md5 = crypto.createHash('md5');
  const crypted = md5.update(data).digest('hex');
  return crypted;
};

const checkNameAvailable = (name) => {
  if (!/^[a-zA-Z0-9-_]{1,50}$/.test(name)) {
    throw new ValidationError('用户名称不合法，预期格式：/^[a-zA-Z0-9-_]{1,50}$/');
  }
  if (['api'].includes(name)) {
    throw new ValidationError('输入的名称是保留字，不能被创建');
  }
};

const generateOrgIdByUserIdAndOrgName = (id, name) => {
  checkNameAvailable(name);
  return `${id}:${name}`;
};

class Webhook {
  static ROUTE = 'webhookTriggered';
  static getUrl(appId) {
    return `${WEBHOOK_URL}/api/common/${this.ROUTE}?app_id=${appId}`;
  }
}

module.exports = {
  Webhook,
  checkNameAvailable,
  generateOrgIdByUserIdAndOrgName,
  unless,
  retryOnce,
  formatBranch,
  md5Encrypt,
  unionId: customAlphabet(UID_TOKEN, 16),
  unionToken: customAlphabet(UID_TOKEN_UPPERCASE, 16),
};
