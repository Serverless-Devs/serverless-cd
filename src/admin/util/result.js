const getCode = (arg) => (arg instanceof Error ? arg.code : arg);

class Result {
  static ofError(message, code) {
    return {
      code: code ? getCode(code) || 500 : 500,
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

