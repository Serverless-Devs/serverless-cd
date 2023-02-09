const OssClient = require('ali-oss');
const Fc = require('@serverless-cd/srm-aliyun-fc2');
const { CREDENTIALS, OSS_CONFIG } = require('@serverless-cd/config');

module.exports = class Client {
  static oss() {
    return new OssClient({
      accessKeyId: CREDENTIALS.accessKeyId,
      accessKeySecret: CREDENTIALS.accessKeySecret,
      bucket: OSS_CONFIG.bucket,
      region: OSS_CONFIG.region,
      timeout: `${1 * 60 * 1000}`, // min
    });
  }

  static fc(region) {
    return new Fc(CREDENTIALS.accountId, {
      accessKeyID: CREDENTIALS.accessKeyId,
      accessKeySecret: CREDENTIALS.accessKeySecret,
      region,
      timeout: 60 * 1000,
    });
  }
};
