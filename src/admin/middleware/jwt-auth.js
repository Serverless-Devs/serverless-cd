const { JWT_SECRET, EXCLUDE_AUTH_URL } = require('@serverless-cd/config');
const { lodash: _ } = require('@serverless-cd/core');
const jwt = require('jsonwebtoken');
const { NeedLogin } = require('../util');
const debug = require('debug')('serverless-cd:middleware');


module.exports = async function (req, _res, next) {
  const token = _.get(req, 'cookies.jwt');
  if (_.includes(EXCLUDE_AUTH_URL, req._parsedUrl.pathname) || req._parsedUrl.pathname === '/api/common/init') {
    // 为了 vm 能够拿到登陆数据，所以需要尝试解析一下是否可能存在
    try {
      const user = await jwt.verify(token, JWT_SECRET)
      req.userId = user.userId;
      req.orgId = user.orgId;
    } catch (e) {/** 不阻塞主程序运行 */ }
    return next();
  }

  if (_.isEmpty(req.headers.cd_token)) {
    if (token) {
      try {
        const user = await jwt.verify(token, JWT_SECRET);
        if (_.isNil(user.userId) || _.isNil(user.orgId)) {
          next(new NeedLogin('没有用户或者团队信息'));
        }
        debug('verify user:: ', user);
        req.userId = user.userId;
        req.orgId = user.orgId;
        next();
      } catch (error) {
        next(new NeedLogin(error.message));
      }
    } else {
      debug('need login:: ', req.url);
      next(new NeedLogin('need login'));
    }
  } else {
    next();
  }
};
