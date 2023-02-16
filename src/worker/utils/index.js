const { CREDENTIALS, OSS_CONFIG } = require('@serverless-cd/config');

function getOssConfig() {
  if (OSS_CONFIG && OSS_CONFIG.bucket) {
    // const stsConfig = CREDENTIALS.stsToken ? {
    //   refreshSTSTokenInterval: 10 * 1000,
    //   refreshSTSToken: async () => {
    //     const refreshToken = await axios.get('https://127.0.0.1/sts');
    //     return {
    //       accessKeyId: refreshToken.data.credentials.AccessKeyId,
    //       accessKeySecret: refreshToken.data.credentials.AccessKeySecret,
    //       stsToken: refreshToken.data.credentials.SecurityToken,
    //     };
    //   },
    // } : {};
    return {
      ...CREDENTIALS,
      ...OSS_CONFIG,
    };
  }
  return undefined;
}

function getPayload(event) {
  if (Object.prototype.toString.call(event) === '[object Uint8Array]') {
    return JSON.parse(event.toString() || '{}');
  }
  return event;
}

function getTaskPayload(steps = []) {
  return steps.map(({ run, name, process_time, stepCount, status }) => ({
    run: name || run,
    process_time,
    stepCount,
    status,
  }));
}

module.exports = {
  getOssConfig,
  getPayload,
  getTaskPayload,
};
