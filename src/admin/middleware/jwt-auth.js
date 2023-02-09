const { JWT_SECRET, EXCLUDE_AUTH_URL } = require('@serverless-cd/config');
const { lodash: _ } = require('@serverless-cd/core');
const jwt = require('jsonwebtoken');
const { NoPermissionError } = require('../util');
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
          next(new NoPermissionError('没有用户或者组织信息'));
        }
        debug('verify user:: ', user);
        req.userId = user.userId;
        req.orgId = user.orgId;
        next();
      } catch (error) {
        next(new NoPermissionError(error.message));
      }
    } else {
      debug('need login:: ', req.url);
      next(new NoPermissionError('need login'));
    }
  } else {
    next();
  }
};
