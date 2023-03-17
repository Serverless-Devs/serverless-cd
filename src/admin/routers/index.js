const router = require('express').Router();
const jwtAuth = require('../middleware/jwt-auth');
const { CD_PIPELINE_YAML, SUPPORT_LOGIN, GITHUB_REDIRECT_URI } = require('@serverless-cd/config');
const debug = require('debug')('serverless-cd:root');

router.get('/', jwtAuth, async function (req, res, _next) {
  const config = {
    CD_PIPELINE_YAML,
    SUPPORT_LOGIN,
    REDIRECT_URL: GITHUB_REDIRECT_URI,
  };
  debug(`set index config: ${JSON.stringify(config)}`);
  res.render('index', { CONFIG: config });
});

router.post('/initialize', async (_req, res) => {
  await require('../services/init.service')();
  res.send('');
})

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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
