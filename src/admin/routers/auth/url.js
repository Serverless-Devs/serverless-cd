const router = require('express').Router();
const { GITHUB } = require('../../config/config');
const { Result } = require('../../util');

router.get('/github', (_req, res) => {
  const authorize_uri = 'https://github.com/login/oauth/authorize';
  const redirect_uri = GITHUB.redirectUrl;
  res.json(
    Result.ofSuccess(`${authorize_uri}?client_id=${GITHUB.clientId}&redirect_uri=${redirect_uri}`),
  );
});

module.exports = router;
