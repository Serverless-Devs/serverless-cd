const router = require("express").Router();
const { GITHUB } = require("../../config");
const { Result } = require("../../util");

router.get("/github", (req, res) => {
  const authorize_uri = "https://github.com/login/oauth/authorize";
  const redirect_uri = GITHUB.redirectUrl;
  res.json(Result.ofSuccess(`${authorize_uri}?client_id=${GITHUB.clientId}&redirect_uri=${redirect_uri}`));
});

module.exports = router;
