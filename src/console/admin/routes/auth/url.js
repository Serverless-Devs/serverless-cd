const router = require("express").Router();
const { GITHUB } = require("../../config");
const { generateSuccessResult } = require("../../util");

router.get("/github", (req, res) => {
  const authorize_uri = "https://github.com/login/oauth/authorize";
  const redirect_uri = GITHUB.redirectUrl;
  res.json(generateSuccessResult(`${authorize_uri}?client_id=${GITHUB.clientId}&redirect_uri=${redirect_uri}`));
});

module.exports = router;
