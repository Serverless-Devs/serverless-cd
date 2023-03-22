const router = require('express').Router();
const { CD_PIPELINE_YAML, SUPPORT_LOGIN, GITHUB_REDIRECT_URI } = require('@serverless-cd/config');
const debug = require('debug')('serverless-cd:root');

// 首页
router.get('/', async function (req, res, _next) {
  const config = {
    CD_PIPELINE_YAML,
    SUPPORT_LOGIN,
    REDIRECT_URL: GITHUB_REDIRECT_URI,
  };
  debug(`set index config: ${JSON.stringify(config)}`);
  res.render('index', { CONFIG: config });
});

module.exports = router;
