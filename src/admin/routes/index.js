const router = require('express').Router();
const { Result } = require('../util');
const { CD_PIPLINE_YAML } = require('../config');
const { ValidationError, NotFoundError } = require('../util/custom-errors');

router.get('/', function (req, res, next) {
  res.render('index', { CD_PIPLINE_YAML });
});

router.use('/flow/application', require('./application'));
router.use('/flow/task', require('./task'));
router.use('/flow/dispatch', require('./dispatch'));

router.use('/github', require('./github'));
router.use('/auth', require('./auth'));
router.use('/user', require('./user'));
router.use('/tokens', require('./tokens'));
router.use('/proxy', require('./proxy'));

router.use(function (err, _req, res, next) {
  if (err.name === ValidationError.name) {
    return res.json(Result.ofError(err.message, ValidationError));
  } else if (err.name === NotFoundError.name) {
    return res.json(Result.ofError(err.message, NotFoundError));
  }
  return res.json(Result.ofError(err.message));
});

module.exports = router;
