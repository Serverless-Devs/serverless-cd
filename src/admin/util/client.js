const OssClient = require('ali-oss');
const Fc = require('@serverless-cd/srm-aliyun-fc2');
const { CREDENTIALS, OSS_CONFIG } = require('@serverless-cd/config');

const { accessKeyId, accessKeySecret, accountId, securityToken } = CREDENTIALS;

module.exports = class Client {
  static oss() {
    if (OSS_CONFIG) {
      return new OssClient({
        accessKeyId,
        accessKeySecret,
        stsToken: securityToken,
        bucket: OSS_CONFIG.bucket,
        region: OSS_CONFIG.region,
        timeout: `${1 * 60 * 1000}`, // min
      });
    }
    console.warn('没有配置 OSS bucket');
  }

  static fc(region) {
    return new Fc(accountId, {
      accessKeyID: accessKeyId,
      accessKeySecret,
      securityToken,
      region,
      timeout: 60 * 1000,
    });
  }
};
