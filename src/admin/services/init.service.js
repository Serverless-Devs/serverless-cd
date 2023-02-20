const { fs } = require('@serverless-cd/core');
const { spawnSync } = require('child_process');
const { prisma } = require('../util');

const DB_TYPE = {
  sqlite: async () => {
    const filePath = databaseUrl.replace('file:', '');
    console.log('databaseUrl: ', databaseUrl);
    console.log('filePath: ', filePath);
    try {
      await fs.remove(filePath);
    } catch (e) { }
    await fs.outputFile(filePath, '');
    console.log('invoke end: ', await fs.pathExists(filePath));
    spawnSync('npm i @prisma/engines@4.9.0 --registry=https://registry.npmmirror.com --force', {
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
    spawnSync('npm i @prisma/engines@4.9.0 --registry=https://registry.npmmirror.com --force', {
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
  // 判断数据表是否已经存在
  try {
    await prisma.user.findUnique({ where: { id: '2' } });
    return;
  } catch (ex) {
    if (ex.code !== 'P2021') {
      return;
    }
  }

  await DB_TYPE[dbType]();
}