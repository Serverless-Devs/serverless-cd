const router = require('express').Router();
const { CD_PIPLINE_YAML, SUPPORT_LOGIN } = require('../config/config');

router.get('/', function (_req, res, _next) {
  res.render('index', { CD_PIPLINE_YAML, SUPPORT_LOGIN });
});

const defaultRoutes = [
  {
    path: '/auth',
    route: require('./auth'),
  },
  // {
  //   path: '/tokens',
  //   route: require('./tokens'),
  // },
  // {
  //   path: '/github',
  //   route: require('./github'),
  // },
  // {
  //   path: '/application',
  //   route: require('./application'),
  // },
  // {
  //   path: '/task',
  //   route: require('./task'),
  // },
  // {
  //   path: '/deploy',
  //   route: require('./dispatch'),
  // }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
