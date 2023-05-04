const _ = require('lodash');
const Fc = require('@serverless-cd/srm-aliyun-fc2');
const { CREDENTIALS } = require('@serverless-cd/config');

// // 获取密钥配置
// const accountId = envs.ACCOUNT_ID || envs.FC_ACCOUNT_ID;
// const accessKeyId = envs.ACCESS_KEY_ID || envs.ALIBABA_CLOUD_ACCESS_KEY_ID;
// const accessKeySecret = envs.ACCESS_KEY_SECRET || envs.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
const { accessKeyId, accessKeySecret, accountId, securityToken } = CREDENTIALS;

module.exports = class Client {
  static fc(region) {
    return new Fc(accountId, {
      accessKeyID: accessKeyId,
      accessKeySecret,
      securityToken,
      region,
      timeout: 60 * 1000,
      // internal: !!process.env.FC_QUALIFIER, // TODO: 区分环境
    });
  }

  static generateFc(region, accountId, accessKeyId, accessKeySecret, securityToken) {
    return new Fc(accountId, {
      accessKeyID: accessKeyId,
      accessKeySecret,
      securityToken,
      region,
      timeout: 60 * 1000,
    });
  }
};
