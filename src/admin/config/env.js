const { ValidationError } = require('../util/custom-errors');

const {
  // 用于支持 github 登陆
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI,
  // 创建 webhook 的回调地址
  WEBHOOKURL,
  // 用于调用函数计算函数，需要用到的点：重新部署、使用了 OTS、读 TASK
  ACCOUNTID: ACCOUNT_ID,
  ACCESS_KEY_ID,
  ACCESS_KEY_SECRET,
  // 查询 Task 存储在 OSS 的日志
  OSS_BUCKET,
  // 函数部署的地区和服务名称
  REGION,
  SERVICE_NAME,
  // 运行engine的函数名称
  WORKER_FUNCTION_NAME,
  // JWT 鉴权 Token
  COOKIE_SECRET: JWT_SECRET,
} = process.env;

if (!JWT_SECRET) {
  throw new ValidationError('未设置环境变量COOKIE_SECRET');
}

const supportGithubLogin = !(
  !GITHUB_CLIENT_ID ||
  GITHUB_CLIENT_ID.startsWith('${env.') ||
  !GITHUB_CLIENT_SECRET ||
  GITHUB_CLIENT_SECRET.startsWith('${env.')
);

module.exports = {
  GITHUB: {
    clientId: GITHUB_CLIENT_ID,
    secret: GITHUB_CLIENT_SECRET,
    redirectUrl: `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}`
  },
  WEBHOOK_URL: WEBHOOKURL || `http://${process.env.DOMAIN}`,
  CREDENTIALS: {
    accountId: ACCOUNT_ID,
    accessKeyId: ACCESS_KEY_ID,
    accessKeySecret: ACCESS_KEY_SECRET,
  },
  OSS_CONFIG: {
    bucket: OSS_BUCKET,
    region: `oss-${REGION}`,
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
  JWT_SECRET,
};
