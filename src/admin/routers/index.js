const _ = require('lodash');
const router = require('express').Router();
const debug = require('debug')('serverless-cd:root');
const checkAppAssociateUser = require('../middleware/auth/application');
const checkTaskAssociateApp = require('../middleware/auth/task');

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
    middleware: [checkAppAssociateUser],
  },
  {
    path: '/task',
    route: require('./task'),
    middleware: [checkAppAssociateUser, checkTaskAssociateApp],
  },
  {
    path: '/dispatch',
    route: require('./dispatch'),
    middleware: [checkAppAssociateUser],
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
  const middleware = _.get(route, 'middleware', []);
  router.use(route.path, ...middleware, route.route);
});

router.all('*', (req) => {
  debug(`不支持此接口 /api${req.path}`);
  throw new Error(`不支持此接口 /api${req.path}`);
});

module.exports = router;
