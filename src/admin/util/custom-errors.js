class ValidationError extends Error {
  static code = 424;

  constructor(message) {
    super(message);
  }
}

class NotFoundError extends Error {
  static code = 400;
  
  constructor(message) {
    super(message);
  }
}

class NoPermissionError extends Error {
  static code = 401;
  
  constructor(message) {
    super(message);
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  NoPermissionError,
};
