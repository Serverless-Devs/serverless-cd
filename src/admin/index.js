const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}
require('express-async-errors');
const express = require('express');
const { lodash: _ } = require('@serverless-cd/core');
const cookieParser = require('cookie-parser');
const jwtAuth = require('./middleware/jwt-auth');
const { unless } = require('./util/index');
const { EXCLUDE_AUTH_URL } = require('./config');
const tokenAuth = require('./middleware/token-auth');

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
// 首页
app.use('/', require('./routes'));

app.use(
  '/api',
  unless((req) => _.includes(EXCLUDE_AUTH_URL, req.url), jwtAuth),
  unless((req) => _.includes(EXCLUDE_AUTH_URL, req.url), tokenAuth),
  require('./routes'),
);
// 兼容前端brower history
app.use('/*', require('./routes'));

app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message,
  });
});

const server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

server.timeout = 0; // never timeout
server.keepAliveTimeout = 0; // keepalive, never timeout
