const { COOKIE_SECRET } = require('../config');
const { lodash: _ } = require('@serverless-cd/core');
const jwt = require('jsonwebtoken');
const { Result, NoPermissionError } = require('../util');

module.exports = async function (req, res, next) {
  if (_.isEmpty(req.headers.cd_token)) {
    const token = _.get(req, 'cookies.jwt');
    if (token) {
      try {
        const user = await jwt.verify(token, COOKIE_SECRET);
        if (_.isEmpty(user.userId)) {
          return res.json(Result.ofError(error.message, NoPermissionError));
        }
        console.log('verify user:: ', user);
        req.userId = user.userId;
        next();
      } catch (error) {
        return res.json(Result.ofError(error.message, NoPermissionError.code));
      }
    } else {
      return res.json(Result.ofError('need login', NoPermissionError.code));
    }
  } else {
    next();
  }
};
