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
  if (access === '{{ access }}') { /* TODO */ }
  const credentials = await core.getCredential(access);
  const {
    SecurityToken,
    AccountID,
    AccessKeyID,
    AccessKeySecret,
  } = credentials;
  parameters._custom_secret_list = {
    ACCOUNT_ID: AccountID,
    ACCESS_KEY_ID: AccessKeyID,
    ACCESS_KEY_SECRET: AccessKeySecret,
  };
  if (SecurityToken) {
    _.set(parameters, '_custom_secret_list.SecurityToken', SecurityToken);
  }
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

  return parameters;
}

module.exports = {
  postInit,
  preInit,
};
