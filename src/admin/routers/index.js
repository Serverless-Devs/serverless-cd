const router = require('express').Router();
const debug = require('debug')('serverless-cd:root');

const defaultRoutes = [
  {
    path: '/auth',
    route: require('./auth'),
  },
  {
    path: '/user',
    route: require('./user'),
  },
  {
    path: '/org',
    route: require('./org'),
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
    path: '/dispatch',
    route: require('./dispatch'),
  },
  {
    path: '/github',
    route: require('./code-provider/github'),
  },
  {
    path: '/common',
    route: require('./common'),
  },
  {
    path: '/resource/fc',
    route: require('./resource/fc'),
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.all('*', (req, res) => {
  debug(`不支持此接口 /api${req.path}`);
  throw new Error(`不支持此接口 /api${req.path}`);
})

module.exports = router;
