class ValidationError extends Error {
  code = 'Invalid';
  static code = 'Invalid';
  constructor(message) {
    super(message);
  }
}

class NotFoundError extends Error {
  code = 'NotFound';
  static code = 'NotFound';
  constructor(message) {
    super(message);
  }
}

// 权限不足
class NoPermissionError extends Error {
  code = 'NoPermission';
  static code = 'NoPermission';
  constructor(message) {
    super(message);
  }
}

// 无权限
class NoAuthError extends Error {
  code = 'Forbidden';
  static code = 'Forbidden';
  constructor(message) {
    super(message);
  }
}

class NeedLogin extends Error {
  code = 'NeedLogin';
  static code = 'NeedLogin';
  constructor(message) {
    super(message);
  }
}

module.exports = {
  NoAuthError,
  NeedLogin,
  ValidationError,
  NotFoundError,
  NoPermissionError,
};
