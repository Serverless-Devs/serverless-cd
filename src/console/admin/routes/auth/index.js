const router = require("express").Router();

router.use("/url", require("./url"));
router.use("/callback", require("./callback"));
router.use("/account", require("./account"));

module.exports = router;
