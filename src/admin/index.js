const path = require('path');
const fs = require('fs');
const debug = require('debug')('serverless-cd:server');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({path: envPath});
}
require('express-async-errors');
const express = require('express');
const {lodash: _} = require('@serverless-cd/core');
const cookieParser = require('cookie-parser');
const jwtAuth = require('./middleware/jwt-auth');
const logger = require('./middleware/logger');
const {errorHandler} = require('./middleware/error');

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
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// 首页
app.use('/', require('./routes'));

app.use(
    '/api',
    jwtAuth,
    logger,
    require('./routes'),
);

// 兼容前端brower history
app.use('/*', require('./routes'));

app.use(errorHandler);

const server = app.listen(PORT, HOST);
debug(`Running on http://${HOST}:${PORT}`);

server.timeout = 0; // never timeout
server.keepAliveTimeout = 0; // keepalive, never timeout
