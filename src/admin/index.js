const path = require('path');
const debug = require('debug')('serverless-cd:server');
require('express-async-errors');
const express = require('express');
const { lodash: _ } = require('@serverless-cd/core');
const cookieParser = require('cookie-parser');
const jwtAuth = require('./middleware/jwt-auth');
const logger = require('./middleware/logger');
const { errorHandler } = require('./middleware/error');

const app = express();
const PORT = 9000;
const HOST = '0.0.0.0';
// 解决 @octokit/request 报错 globalThis is not defined
globalThis = global;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.raw());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.post('/initialize', async (_req, res) => {
  console.log('Starting initialize');
  // 为了不引入 @serverless-devs/core 包；如果引入可以这样写
  // const { Initialize } = require('@serverless-cd/serverless-script');
  const Initialize = require('@serverless-cd/serverless-script/src/initialize');
  const initialize = new Initialize();
  await initialize.init();
  console.log('Initialize ends');
  res.send('');
});

// 接口
app.use('/api', jwtAuth, logger, require('./routers'));

// 需要写在最后，为了兼容前端指定非 api 的路由
app.use('/*', require('./routers/root'));

app.use(errorHandler);

const server = app.listen(PORT, HOST);
debug(`Running on http://${HOST}:${PORT}`);

server.timeout = 0; // never timeout
server.keepAliveTimeout = 0; // keepalive, never timeout
