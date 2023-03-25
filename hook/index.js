const path = require('path');
const core = require('./core');
const lodash = core.lodash;

async function preInit(inputObj) {
  const logger = new inputObj.Logger('');
  if (process.env['CLI_VERSION'] < '2.1.12') {
    logger.log(
      'CLI 版本过低, 可以执行 "npm i @serverless-devs/s -g --registry=https://registry.npmmirror.com" 升级·',
      'yellow',
    );
  }
}

async function genDomain(logger, access, region, serviceName) {
  logger.debug('获取密钥');
  const credentials = await core.getCredential(access);
  logger.debug('下载 domain 组件');
  const domainComponent = await core.load('devsapp/domain');
  logger.debug('生成 domain 域名');
  const domainName = await domainComponent.get({
    project: { access },
    credentials,
    props: {
      type: 'fc',
      user: credentials.AccountID,
      region,
      service: serviceName,
      function: 'auto',
    },
  });
  return domainName;
}

async function getAccess(access) {
  if (process.env.BUILD_IMAGE_ENV !== 'fc-backend') {
    return access;
  }

  const accessPath = path.join(core.getRootHome(), 'access.yaml');
  const data = await core.getYamlContent(accessPath);
  if (lodash.isEmpty(data)) {
    return access;
  }
  if (data[access]) {
    return access;
  }
  return Object.keys(data)[0];
}

async function postInit(inputObj) {
  const { lodash: _, parameters, Logger } = inputObj;
  const logger = new Logger('serverless-cd');

  const { region, serviceName, prisma } = parameters;
  const access = await getAccess(parameters.access);
  if (!access || access === '{{ access }}') {
    logger.warn('您没有选择密钥，我们将跳过一些自动化，请仔细阅读文档xxxxx完成初始化动作');
    return parameters;
  }

  logger.debug('jwt 处理');
  _.set(parameters, '_custom_secret_list.JWT_SECRET', Math.random().toString(16).substring(2));
  logger.debug('jwt 处理结束');

  logger.debug('域名处理');
  const domainName = await genDomain(logger, access, region, serviceName);
  _.set(parameters, 'domain', domainName);
  logger.debug('域名处理结束');

  logger.debug('数据库连接地址处理');
  if (['mysql', 'mongodb'].includes(prisma)) {
    logger.log(
      `\n\n注意：需要在 .env 文件中配置DATABASE_URL，否则会影响链接数据库\n  示例：${prisma}://USER:PASSWORD@HOST:PORT/DATABASE`,
      'red',
    );
    _.set(parameters, '_custom_secret_list.DATABASE_URL', ' # 需要填写配置路径');
    _.set(parameters, 'databaseUrl', '${env.DATABASE_URL}');
  } else {
    _.set(parameters, 'databaseUrl', 'file:/mnt/auto/dev.db');
    try {
      // const dbPath = path.join(targetPath, 'local.db');
      // _.set(parameters, '_custom_secret_list.DATABASE_URL', dbPath);
      // TODO: 通过 inputObj.fse 写一个 db 文件
    } catch (e) {
      /** */
    }
  }
  logger.debug('数据库连接地址处理结束');

  return parameters;
}

module.exports = {
  postInit,
  preInit,
};
