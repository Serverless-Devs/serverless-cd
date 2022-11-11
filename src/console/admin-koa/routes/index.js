var router = require('koa-router')();

router.get('/demo', async function (ctx, next) {
  ctx.body = { foo: 'bar' }
})
module.exports = router;
