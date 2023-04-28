const _ = require('lodash');
const Fc = require('@serverless-cd/srm-aliyun-fc2');
const { CREDENTIALS } = require('@serverless-cd/config');

const { accessKeyId, accessKeySecret, accountId, securityToken } = CREDENTIALS;

module.exports = class Client {
  static fc(region) {
    return new Fc(accountId, {
      accessKeyID: accessKeyId,
      accessKeySecret,
      securityToken,
      region,
      timeout: 60 * 1000,
      internal: !!process.env.FC_QUALIFIER, // TODO: 区分环境
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
