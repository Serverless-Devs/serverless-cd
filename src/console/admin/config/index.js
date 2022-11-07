const {
  DOWNLOAD_CODE_DIR,
  CD_PIPLINE_YAML,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI,
  WEBHOOKURL,
  ACCOUNTID,
  ACCESS_KEY_ID,
  ACCESS_KEY_SECRET,
  OSS_BUCKET,
  OTS_INSTANCE_NAME,
  OTS_TASK_TABLE_NAME,
  OTS_TASK_INDEX_NAME,
  OTS_USER_TABLE_NAME,
  OTS_USER_INDEX_NAME,
  OTS_APP_TABLE_NAME,
  OTS_APP_INDEX_NAME,
  OTS_SESSION_TABLE_NAME,
  OTS_TOKEN_TABLE_NAME,
  OTS_TOKEN_INDEX_NAME,
  SESSION_EXPIRATION,
  WORKER_FUNCTION_NAME,
  SERVICE_NAME,
  REGION,
} = process.env;

const supportGithubLogin = !((!GITHUB_CLIENT_ID || GITHUB_CLIENT_ID.startsWith('${env.')) || (!GITHUB_CLIENT_SECRET || GITHUB_CLIENT_SECRET.startsWith('${env.')));

module.exports = {
  CD_PIPLINE_YAML,
  SESSION_EXPIRATION,
  CODE_DIR: DOWNLOAD_CODE_DIR,
  GITHUB: {
    webhook: WEBHOOKURL,
    clientId: GITHUB_CLIENT_ID,
    secret: GITHUB_CLIENT_SECRET,
    redirectUrl: GITHUB_REDIRECT_URI,
  },
  WEBHOOKURL,
  CREDENTIALS: {
    accountId: ACCOUNTID,
    accessKeyId: ACCESS_KEY_ID,
    accessKeySecret: ACCESS_KEY_SECRET,
  },
  OSS_CONFIG: {
    bucket: OSS_BUCKET,
    region: `oss-${REGION}`,
  },
  OTS: {
    region: REGION,
    instanceName: OTS_INSTANCE_NAME,
  },
  OTS_TASK: {
    name: OTS_TASK_TABLE_NAME,
    index: OTS_TASK_INDEX_NAME,
  },
  OTS_USER: {
    name: OTS_USER_TABLE_NAME,
    index: OTS_USER_INDEX_NAME,
  },
  OTS_APPLICATION: {
    name: OTS_APP_TABLE_NAME,
    index: OTS_APP_INDEX_NAME,
  },
  OTS_SESSION: {
    name: OTS_SESSION_TABLE_NAME,
  },
  OTS_TOKEN: {
    name: OTS_TOKEN_TABLE_NAME,
    index: OTS_TOKEN_INDEX_NAME
  },
  FC: {
    workerFunction: {
      region: REGION,
      serviceName: SERVICE_NAME,
      functionName: WORKER_FUNCTION_NAME,
    },
  },
  SUPPORT_LOGIN: {
    github: supportGithubLogin,
    account: true,
  },
};
