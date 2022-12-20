const { COOKIE_SECRET } = require('../config');
const { lodash: _ } = require('@serverless-cd/core');
const jwt = require("jsonwebtoken");
const { setReqConfig } = require('../util');

module.exports = async function (req, res, next) {
  if (_.isEmpty(req.headers.cd_token)) {
    const token = _.get(req, 'cookies.jwt');
    console.log('req.cookies:: ', req.cookies, token);
    if (token) {
      const user = await jwt.verify(token, COOKIE_SECRET);
      console.log('user:: ', user);
      setReqConfig(req, { userId: user.userId });
    }
    next();
  } else {
    next();
  }
};
