class ValidationError extends Error {
  code = 424;
  static code = 424;
  constructor(message) {
    super(message);
  }
}

class NotFoundError extends Error {
  code = 400;
  static code = 400;
  constructor(message) {
    super(message);
  }
}

class NoPermissionError extends Error {
  code = 403;
  static code = 403;
  constructor(message) {
    super(message);
  }
}

class NeedLogin extends Error {
  code = 401;
  static code = 401;
  constructor(message) {
    super(message);
  }
}

module.exports = {
  NeedLogin,
  ValidationError,
  NotFoundError,
  NoPermissionError,
};
