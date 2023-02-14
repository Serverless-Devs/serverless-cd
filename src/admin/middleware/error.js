const { ValidationError, Result, NotFoundError, NoPermissionError, NeedLogin } = require('../util');

const errorHandler = (err, req, res, next) => {
  let errorRes = {};
  if (err instanceof ValidationError) {
    errorRes = Result.ofError(err.message, ValidationError);
  } else if (err instanceof NotFoundError) {
    errorRes = Result.ofError(err.message, NotFoundError);
  } else if (err instanceof NoPermissionError) {
    errorRes = Result.ofError(err.message, NoPermissionError);
  } else if (err instanceof NeedLogin) {
    errorRes = Result.ofError(err.message, NeedLogin);
  } else {
    console.log('非预期错误，统一 500');
    errorRes = Result.ofError(err.message, 500);
  }
  console.log(err);
  res.json(errorRes);
};

module.exports = {
  errorHandler,
};
