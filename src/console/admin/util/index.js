const { customAlphabet } = require("nanoid");
const axios = require("axios");
const crypto = require('crypto');
const _ = require('lodash');


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

// 公共数据存储到 session
function doSession(req, data) {
  for (const key in data) {
    _.set(req, `session.${key}`, data[key]);
  }
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

module.exports={
  doSession,
  md5Encrypt,
  generateErrorResult,
  generateSuccessResult,
  unionid: customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 16),
  unionToken: customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 40),
  githubRequest,
  ValidationError,
  formatBranch
}