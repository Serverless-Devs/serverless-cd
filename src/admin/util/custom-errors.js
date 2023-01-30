class ValidationError extends Error {
  constructor(message) {
    super(message);
  }
}
ValidationError.code = 424;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
  }
}
NotFoundError.code = 400;

class NoPermissionError extends Error {
  constructor(message) {
    super(message);
  }
}
NoPermissionError.code = 401;

module.exports = {
  ValidationError,
  NotFoundError,
  NoPermissionError,
};
