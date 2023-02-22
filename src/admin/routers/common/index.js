const router = require('express').Router();
const { Result } = require('../../util');
const init = require('../../services/init.service');

router.get('/init', async function (req, res) {
  const { prisma = 'sqlite' } = req.query;
  await init(prisma);
  return res.json(Result.ofSuccess());
});


module.exports = router;
