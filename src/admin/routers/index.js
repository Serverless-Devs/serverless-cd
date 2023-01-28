const router = require('express').Router();
const { CD_PIPLINE_YAML, SUPPORT_LOGIN, GITHUB } = require('../config/config');

router.get('/', function (_req, res, _next) {
  const config = {
    CD_PIPLINE_YAML,
    SUPPORT_LOGIN,
    REDIRECT_URL: GITHUB.redirectUrl,
  };
  res.render('index', { CONFIG: config });
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
