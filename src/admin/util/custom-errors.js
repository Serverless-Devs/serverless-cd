class ValidationError extends Error {
  code = 'Validation';
  static code = 'Validation';
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


class NoPermissionError extends Error {
  code = 'NoPermission';
  static code = 'NoPermission';
  constructor(message) {
    super(message);
  }
}

class NoAuthError extends Error {
  code = 'NoAuth';
  static code = 'NoAuth';
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
