const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}
require('express-async-errors');
const express = require('express');
const createError = require('http-errors');
const cookieAuth = require('./middleware/cookie-auth');
const sessionAuth = require('./middleware/jwd-auth');
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

// 首页
app.use('/', require('./routes'));

app.use(cookieAuth);
app.use(sessionAuth);
app.use(tokenAuth);

app.use('/api', require('./routes'));
// fallback
app.use('/*', require('./routes'));
app.use(function (req, _res, next) {
  next(createError(404, `接口没有找到 ${req.path}`));
});

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
