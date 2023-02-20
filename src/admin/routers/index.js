const router = require('express').Router();
const jwtAuth = require('../middleware/jwt-auth');
const { CD_PIPELINE_YAML, SUPPORT_LOGIN, GITHUB_REDIRECT_URI } = require('@serverless-cd/config');
const debug = require('debug')('serverless-cd:root');
// const orgService = require('../services/org.service');

router.get('/', jwtAuth, async function (req, res, _next) {
  // const { role: ROLE, name: ORG_NAME } = await orgService.getOrgById(req.orgId);
  const config = {
    CD_PIPELINE_YAML,
    SUPPORT_LOGIN,
    // ROLE,
    // ORG_NAME,
    REDIRECT_URL: GITHUB_REDIRECT_URI,
  };
  debug(`set index config: ${JSON.stringify(config)}`);
  res.render('index', { CONFIG: config });
});

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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
