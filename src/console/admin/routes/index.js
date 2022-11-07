const router = require("express").Router();
const { generateErrorResult } = require('../util');

router.use("/application", require("./application"));
router.use("/task", require("./task"));
router.use("/github", require("./github"));
router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/flow/dispatch", require("./dispatch"));
router.use("/tokens", require("./tokens"));

router.use(function (err, _req, res, next) {
  if (err.name === "ValidationError") {
    return res.status(422).json(generateErrorResult(err.message));
  }

  res.status(500).json(generateErrorResult(err.message));
});

module.exports = router;
