const router = require('express').Router();
const { CD_PIPELINE_YAML, SUPPORT_LOGIN, GITHUB } = require('@serverless-cd/config');

router.get('/', function (req, res, _next) {
  const config = {
    CD_PIPELINE_YAML,
    SUPPORT_LOGIN,
    REDIRECT_URL: GITHUB.redirectUrl,
    // TODO:
    //   遇到问题， vm 貌似仅仅第一返回给前端，然后注册之后怎么办
    // ROLE: 
  };
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
    path: '/application',
    route: require('./application'),
  },
  {
    path: '/task',
    route: require('./task'),
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
