const Koa = require('koa');
const fs = require('fs');
const onerror = require('koa-onerror');
const router = require('koa-router')();
const _ = require('@serverless-cd/core').lodash;
const { LOG_LOCAL_PATH_PREFIX } = require('@serverless-cd/config');
const getRowBody = require('raw-body');
const { handler } = require('./index');
const { getPayload } = require('./utils');

const app = new Koa();
const PORT = 9000;
const HOST = '0.0.0.0';
onerror(app);

router.post('/invoke', async (ctx) => {
  require('child_process').execSync('node -v', { stdio: 'inherit' });
  const body = await new Promise((r) => getRowBody(ctx.req, (_err, body) => r(body)));
  // 读取日志
  const { taskId, stepCount, token } = getPayload(body);
  if (_.isEmpty(token)) {
    console.log("taskId, stepCount: ", taskId, stepCount);
    const logPath = `${LOG_LOCAL_PATH_PREFIX}/${taskId}/step_${stepCount}.log`;
    console.log('read log path: ', logPath);
    try {
      const log = fs.readFileSync(logPath, { encoding: 'utf8' });
      ctx.body = {
        code: 200,
        msg: log,
      };
    } catch (ex) {
      console.error('获取日志异常：', ex);
      ctx.body = {
        code: 500,
        msg: ex || '没有找到日志',
      };
    }
    return;
  }

  await new Promise((r) => {
    handler(body, {}, (code, message) => {
      ctx.body = {
        code: code || 200,
        msg: message || '',
      };
      r();
    });
  });
});

app.use(router.routes(), router.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
  ctx.body = {
    code: 400,
    msg: err.message,
  };
});

const server = app.listen(PORT, HOST);
server.timeout = 0;
server.setTimeout(0);
server.keepAliveTimeout = 0;
