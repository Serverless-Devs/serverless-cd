const { ValidationError, Result, NotFoundError, NoPermissionError } = require('../util');

const errorHandler = (err, req, res, next) => {
  let errorRes = {};
  if (err instanceof ValidationError) {
    errorRes = Result.ofError(err.message, ValidationError);
  } else if (err instanceof NotFoundError) {
    errorRes = Result.ofError(err.message, NotFoundError);
  } else if (err instanceof NoPermissionError) {
    errorRes = Result.ofError(err.message, NoPermissionError);
  } else {
    errorRes = Result.ofError(err.message, err.code || 500);
  }
  console.log(err);
  res.json(errorRes);
};

module.exports = {
  errorHandler,
};
