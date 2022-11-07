const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}
const express = require('express');
require('express-async-errors');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressOtsSession = require('@serverless-cd/express-ots-session');

const { OTS, CREDENTIALS, OTS_SESSION, SESSION_EXPIRATION } = require('./config');
const _ = require('lodash');
const { doSession, ValidationError } = require('./util');
const { queryToken, updateToken } = require('./routes/tokens/auth-token');

const app = express();
const PORT = 9000;
const HOST = '0.0.0.0';

globalThis = global; // 解决 @octokit/request 报错 globalThis is not defined

const options = {
  config: {
    ...OTS,
    ...CREDENTIALS,
  },
  tableName: OTS_SESSION['name'],
  indexName: OTS_SESSION['index'],
  expiration: Number(SESSION_EXPIRATION),
};

app.use(express.raw());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  if (_.isEmpty(req.headers.cd_token)) {
    cookieParser()(req, res, next);
  } else {
    console.log('使用了 token 访问接口: ', req.headers.cd_token);
    next();
  }
});

app.use(function (req, res, next) {
  if (_.isEmpty(req.headers.cd_token)) {
    const OtsStore = expressOtsSession(session);
    session({
      store: new OtsStore(options, { session_id: 'id', expire_date: 'expire_time', session_data: 'session_data' }),
      secret: 'secr3t',
      resave: false,
      saveUninitialized: true,
    })(req, res, next);
  } else {
    next();
  }
});

app.use(async function (req, res, next) {
  if (!_.isEmpty(req.headers.cd_token)) {
    // 根据 cd_token 查找 user 的信息，查不到就是异常 查到 就 next
    const { success, data, message } = await queryToken(req.headers.cd_token);
    if (!success) {
      throw new ValidationError(message);
    }
    // 记录登陆token时间
    updateToken(data.id);

    if (data.expire_time !== -1 && Date.now() > data.expire_time) {
      throw new ValidationError('token 已过期');
    }

    console.log('req.headers.cd_token:: ', req.headers.cd_token);
    doSession(req, { userId: data.user_id });
    next();
    return;
  }

  if (!req.session.userId && !req.url.startsWith('/api/auth')) {
    res.status(401).send('Unauthorized');
  } else {
    next();
  }
});

app.use('/api', require('./routes'));

app.use(function (req, _res, next) {
  next(createError(404, `接口没有找到 ${req.path}`));
});

app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
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
