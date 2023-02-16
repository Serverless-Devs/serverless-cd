const path = require('path');
const core = require('./core');

async function preInit(inputObj) {
  const logger = new inputObj.Logger('');
  if (process.env['CLI_VERSION'] < '2.1.12') {
    logger.log(
      'Please upgrade the CLI version to 2.1.12 or above, and you can execute the command "npm i @serverless-devs/s -g --registry=https://registry.npmmirror.com" to upgrade.',
      'yellow',
    );
  }
}

async function postInit(inputObj) {
  const { lodash: _, parameters, Logger } = inputObj;
  const logger = new Logger('serverless-cd');

  const { domain, region, serviceName, JWT_SECRET: jwtSecret, access } = parameters;

  logger.debug('jwt 处理');
  if (_.isEmpty(jwtSecret) || jwtSecret === 'auto') {
    _.set(parameters, 'JWT_SECRET', Math.random().toString(16).substring(2));
  }
  logger.debug('jwt 处理结束');

  logger.debug('密钥设置');
  if (access === '{{ access }}') {
    logger.warn('您没有选择密钥，我们将跳过一些自动化，请仔细阅读文档xxxxx完成初始化动作');
    return parameters;
  }
  const credentials = await core.getCredential(access);
  const {
    SecurityToken,
    AccountID,
    AccessKeyID,
    AccessKeySecret,
  } = credentials;
  logger.debug('密钥设置结束');

  logger.debug('域名处理');
  if (_.isEmpty(domain) || domain === 'auto') {
    const domainComponent = await core.load('devsapp/domain');
    const domainInputs = {
      project: { access },
      credentials,
      props: {
        type: 'fc',
        user: AccountID,
        region,
        service: serviceName,
        function: 'auto',
      },
    };
    const domainName = await domainComponent.get(domainInputs);
    _.set(parameters, 'domain', domainName);
  }
  logger.debug('域名处理结束');

  parameters._custom_secret_list = {
    OSS_BUCKET: parameters.ossBucket,
    REGION: region,
    SERVICE_NAME: serviceName,
    WORKER_FUNCTION_NAME: 'worker',
    DOMAIN: parameters.domain,
    '# WEBHOOK_URL': '',
    ACCOUNT_ID: AccountID,
    ACCESS_KEY_ID: AccessKeyID,
    ACCESS_KEY_SECRET: AccessKeySecret,
  };
  if (SecurityToken) {
    _.set(parameters, '_custom_secret_list.SECURITY_TOKEN', SecurityToken);
  }
  logger.log(`\n\n此提示不影响部署流程：本地调试时需要配置环境变量 WEBHOOK_URL，但是我们在初始化过程无法生成。因为需要真实 master 函数的触发器的公网地址，您可以部署一下，然后配置在 .env 中`, 'yellow');

  return parameters;
}

module.exports = {
  postInit,
  preInit,
};
