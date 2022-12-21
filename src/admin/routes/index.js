const router = require('express').Router();
const { generateErrorResult } = require('../util');
const { CD_PIPLINE_YAML } = require('../config');

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
  if (err.name === 'ValidationError') {
    return res.status(422).json(generateErrorResult(err.message));
  }

  res.status(500).json(generateErrorResult(err.message));
});

module.exports = router;
