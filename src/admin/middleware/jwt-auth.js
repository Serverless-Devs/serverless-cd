const { COOKIE_SECRET } = require('../config');
const { lodash: _ } = require('@serverless-cd/core');
const jwt = require("jsonwebtoken");
const { generateErrorResult} = require('../util');

module.exports = async function (req, res, next) {
  if (_.isEmpty(req.headers.cd_token)) {
    const token = _.get(req, 'cookies.jwt');
    if (token) {
      try {
        const user = await jwt.verify(token, COOKIE_SECRET);
        if(_.isEmpty(user.userId)) {
          return res.status(401).json(generateErrorResult(error.message));
        }
        console.log('verify user:: ', user);
        req.userId = user.userId;
        next();
      } catch (error) {
        return res.status(401).json(generateErrorResult(error.message));
      }
    } else {
      return res.status(401).json(generateErrorResult("need login"));
    }
  } else {
    next();
  }
};
