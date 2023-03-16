const { JWT_SECRET, EXCLUDE_AUTH_URL } = require('@serverless-cd/config');
const { lodash: _ } = require('@serverless-cd/core');
const jwt = require('jsonwebtoken');
const { NeedLogin, generateOrgIdByUserIdAndOrgName } = require('../util');
const debug = require('debug')('serverless-cd:middleware');

module.exports = async function (req, _res, next) {
  const token = _.get(req, 'cookies.jwt');
  const skipCheckJwt = _.includes(EXCLUDE_AUTH_URL, req._parsedUrl.pathname);
  debug(`pathname: ${req._parsedUrl.pathname}, skip check token: ${skipCheckJwt}`);
  if (skipCheckJwt) {
    return next();
  }

  if (_.isEmpty(req.headers.cd_token)) {
    if (token) {
      try {
        const user = await jwt.verify(token, JWT_SECRET);
        if (_.isNil(user.userId)) {
          next(new NeedLogin('没有用户或者团队信息'));
        }
        debug('verify user:: ', user);
        req.userId = user.userId;
        const orgName = _.get(req, 'body.orgName', _.get(req, 'query.orgName'));
        if (orgName) {
          req.orgName = orgName;
          req.orgId = generateOrgIdByUserIdAndOrgName(user.userId, orgName);
        }
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
