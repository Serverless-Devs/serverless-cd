const { JWT_SECRET, EXCLUDE_AUTH_URL } = require('@serverless-cd/config');
const { lodash: _ } = require('@serverless-cd/core');
const jwt = require('jsonwebtoken');
const { NeedLogin } = require('../util');
const debug = require('debug')('serverless-cd:middleware');

module.exports = async function (req, res, next) {
  if (_.includes(EXCLUDE_AUTH_URL, req.url)) {
    return next();
  }

  if (_.isEmpty(req.headers.cd_token)) {
    const token = _.get(req, 'cookies.jwt');
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
