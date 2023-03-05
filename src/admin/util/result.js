const { lodash: _ } = require('@serverless-cd/core');

const getCode = (arg) => {
  if (_.isObject(arg)) {
    return arg.code;
  } else {
    return arg;
  }
};

class Result {
  static ofError(message, code) {
    return {
      code: code ? getCode(code) || 'SystemError' : 'SystemError',
      success: false,
      message,
    };
  }
  static ofSuccess(data, code) {
    return {
      code: code ? getCode(code) || 200 : 200,
      success: true,
      data: data || {},
    };
  }
}

module.exports = Result;
