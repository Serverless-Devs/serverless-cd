const { fs } = require('@serverless-cd/core');
const path = require('path');
const { spawnSync } = require('child_process');
const { prisma } = require('../util');

async function testConnection(_dbType) {
  // 判断数据表是否已经存在
  try {
    await prisma.user.findUnique({ where: { id: '2' } });
    console.log('find unique successfully');
    return true;
  } catch (ex) {
    console.log('find unique error: ' + ex.code);
    return ex.code && ex.code !== 'P2021';
  }
}

const DB_TYPE = {
  sqlite: async () => {
    const databaseUrl = process.env.DATABASE_URL;
    const filePath = databaseUrl.replace('file:', '');
    console.log('databaseUrl: ', databaseUrl);
    console.log('filePath: ', filePath);

    fs.ensureDirSync(path.dirname(filePath));
    try {
      await fs.remove(filePath);
    } catch (ex) {}
    try {
      await fs.copy(path.join(__dirname, '..', 'prisma', 'dev.db'), filePath);
    } catch (ex) {
      throw new Error(`复制 prisma/dev.db 失败，错误信息：${ex}\n请查看 xxx 文档修复项目`);
    }
  },
  mysql: async () => {
    try {
      spawnSync(`npx prisma migrate dev --name init --schema=./prisma/mysql.prisma`, {
        encoding: 'utf8',
        stdio: 'inherit',
        shell: true,
      });
    } catch (ex) {
      throw new Error('链接不上数据库，请查看xxx文档');
    }
  },
  mongodb: async () => {
    // 思路：链接远程数据库，然后使用 db 语法创建命名空间
    console.debug('TODO handler mongodb start');
  },
};

module.exports = async function () {
  // 需要能够获取到链接地址
  let dbType;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL 未配置');
  } else if (databaseUrl.startsWith('file:')) {
    dbType = 'sqlite';
  } else if (databaseUrl.startsWith('mysql:')) {
    dbType = 'mysql';
  } else if (databaseUrl.startsWith('mongodb:')) {
    dbType = 'mongodb';
  } else {
    throw new Error('DATABASE_URL 配置不符合预期或者此数据库还没有支持');
  }

  let connection = await testConnection(dbType);
  console.log(`test connection: ${connection}, dbType: ${dbType}`);
  if (connection) {
    return;
  }
  // 修改函数 强制访问新的容器
  await DB_TYPE[dbType]();
  await prisma.$disconnect();
  await prisma.$connect();

  connection = await testConnection(dbType);
  if (!connection) {
    throw new Error('没有链接上数据表');
  }
};
