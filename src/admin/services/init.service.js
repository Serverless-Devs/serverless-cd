const { fs } = require('@serverless-cd/core');
const path = require('path');
const { spawnSync } = require('child_process');
const { prisma } = require('../util');

async function testConnection(_dbType) {
  // try {
  //   spawnSync(`npx prisma generate --schema=./prisma/${dbType}.prisma`, {
  //     encoding: 'utf8',
  //     stdio: 'inherit',
  //     shell: true,
  //   });
  // } catch (e) { }
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
    // try {
    //   await fs.remove(filePath);
    // } catch (e) { }
    fs.ensureDirSync(path.dirname(filePath));
    await fs.outputFile(filePath, '');
    console.log('invoke end: ', fs.pathExistsSync(filePath));
    spawnSync('npm i @prisma/engines@4.9.0 --no-save --registry=https://registry.npmmirror.com --force', {
      encoding: 'utf8',
      stdio: 'inherit',
      shell: true,
    });
    spawnSync(`npx prisma migrate dev --name init --schema=./prisma/sqlite.prisma`, {
      encoding: 'utf8',
      stdio: 'inherit',
      shell: true,
    });
  },
  mysql: async () => {
    spawnSync('npm i @prisma/engines@4.9.0 --no-save --registry=https://registry.npmmirror.com --force', {
      encoding: 'utf8',
      stdio: 'inherit',
      shell: true,
    });
    spawnSync(`npx prisma migrate dev --name init --schema=./prisma/mysql.prisma`, {
      encoding: 'utf8',
      stdio: 'inherit',
      shell: true,
    });
  },
}

module.exports = async function (dbType) {
  // 需要能够获取到链接地址
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL 未配置');
  }

  for (let i = 1; i < 4; i++) {
    const connection = await testConnection(dbType);
    console.log(`第 ${i} 次，connection: ${connection}, dbType: ${dbType}`);
    if (connection) {
      return;
    }
    await DB_TYPE[dbType]();
    await prisma.$disconnect();
    await prisma.$connect();
    // 修改函数 强制访问新的容器
  }

  const connection = await testConnection(dbType);
  if (!connection) {
    throw new Error('没有链接上数据表');
  }
}