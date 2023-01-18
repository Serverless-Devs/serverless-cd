const router = require('express').Router();
const { CD_PIPLINE_YAML } = require('../config/config');

router.get('/', function (req, res, next) {
  res.render('index', { CD_PIPLINE_YAML });
});

const defaultRoutes = [
  {
    path: '/auth',
    route: require('./auth'),
  },
  {
    path: '/tokens',
    route: require('./tokens'),
  },
  {
    path: '/github',
    route: require('./github'),
  },
  {
    path: '/application',
    route: require('./application'),
  },
  {
    path: '/task',
    route: require('./task'),
  },
  {
    path: '/deploy',
    route: require('./dispatch'),
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
