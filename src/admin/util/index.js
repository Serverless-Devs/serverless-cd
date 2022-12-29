const { customAlphabet } = require("nanoid");
const axios = require("axios");
const crypto = require('crypto');
const { lodash: _ } = require('@serverless-cd/core');

const UID_TOKEN = "1234567890abcdefghijklmnopqrstuvwxyz";
const UID_TOKEN_UPPERCASE = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const githubRequest = (accessToken) => {
  const instance = axios.create({
    baseURL: "https://api.github.com",
    timeout: 3000,
    headers: {
      accept: "application/json",
      Authorization: `token ${accessToken}`,
    },
  });

  return async (url, data = {}) => {
    const [method, path] = url.split(/\s+/);

    if (method === "GET") {
      return await instance.get(path, {
        params: data,
      });
    } else {
      return await instance.post(path, data);
    }
  };
}

/**
 * MD5 加密
 */
const md5Encrypt = (data) => {
  const md5 = crypto.createHash('md5');
  const crypted = md5.update(data).digest('hex');
  return crypted;
}

// 最终返回失败结果
const generateErrorResult = (message) => ({
  success: false,
  message,
});

// 最终返回成功结果
const generateSuccessResult = (data = {}, extend = {}) => ({
  success: true,
  data,
  ...extend
});


/**
 * 解析部署分支字段 （ref）
 * "refs/heads/xxx"
 * "refs/tags/xxx"
 * @param {string} ref
 */
const formatBranch = (ref) => {
  const tagsForma = 'refs/tags/';
  const headsForma = 'refs/heads/';
  if (ref.includes(tagsForma)) {
    return ref.slice(10)
  } else if (ref.includes(headsForma)) {
    return ref.slice(11)
  }
  return ref
}

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
    }
    else {
      middleware(req, res, next);
    }
  }
}

/**
 * 异步重试一次
 * @param promiseFun
 * @param timer
 * @returns {Promise<*>}
 */
async function retryOnce(promiseFun, timer= 500) {
  try {
    return await promiseFun;
  } catch (error) {
    sleep(timer);
    return await promiseFun;
  }
}

module.exports = {
  md5Encrypt,
  generateErrorResult,
  generateSuccessResult,
  unionid: customAlphabet(UID_TOKEN, 16),
  unionToken: customAlphabet(UID_TOKEN_UPPERCASE, 40),
  githubRequest,
  ValidationError,
  formatBranch,
  retryOnce,
  unless
}