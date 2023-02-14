const cookieParser = require('cookie-parser');
const { lodash: _ } = require('@serverless-cd/core');
const debug = require('debug')('serverless-cd:middleware');

module.exports = function (req, res, next) {
  if (_.isEmpty(req.headers.cd_token)) {
    debug('通过 cookie 进行鉴权: ');
    cookieParser()(req, res, next);
  } else {
    debug('通过 token 进行鉴权: ', req.headers.cd_token);
    next();
  }
};
