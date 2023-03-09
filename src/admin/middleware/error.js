const {
  ValidationError,
  ParamsValidationError,
  Result,
  NotFoundError,
  NoPermissionError,
  NeedLogin,
  NoAuthError,
} = require('../util');

const errorHandler = (err, req, res, next) => {
  let errorRes = {};
  if (err instanceof ValidationError) {
    errorRes = Result.ofError(err.message, ValidationError);
  } else if (err instanceof ParamsValidationError) {
    errorRes = Result.ofError(err.message, ParamsValidationError);
  } else if (err.code === 401 && err.message === 'Bad credentials') {
    errorRes = Result.ofError('token 无效，请重新配置', ValidationError);
  } else if (err instanceof NotFoundError) {
    errorRes = Result.ofError(err.message, NotFoundError);
  } else if (err instanceof NoPermissionError) {
    errorRes = Result.ofError(err.message, NoPermissionError);
  } else if (err instanceof NeedLogin) {
    errorRes = Result.ofError(err.message, NeedLogin);
  } else if (err instanceof NoAuthError) {
    errorRes = Result.ofError(err.message, NoAuthError);
  } else {
    console.log('非预期错误，统一 500');
    errorRes = Result.ofError(err.message, 'SystemError');
  }
  console.log(err);
  res.json(errorRes);
};

module.exports = {
  errorHandler,
};
