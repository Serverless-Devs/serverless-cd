const Koa = require('koa');
const onerror = require('koa-onerror');
const router = require('koa-router')();
const getRowBody = require('raw-body');
const { handler } = require('./index');

const app = new Koa();
const PORT = 9000;
const HOST = '0.0.0.0';
onerror(app);

router.post('/invoke', async (ctx) => {
  require('child_process').execSync('node -v', { stdio: 'inherit' });
  const body = await new Promise((r) => getRowBody(ctx.req, (_err, body) => r(body)));
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
