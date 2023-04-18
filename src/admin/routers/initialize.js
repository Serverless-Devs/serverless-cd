const router = require('express').Router();

// 首页
router.post('/initialize', async (_req, res) => {
  console.log('Starting initialize');
  // 为了不引入 @serverless-devs/core 包；如果引入可以这样写
  // const { Initialize } = require('@serverless-cd/serverless-script');
  const Initialize = require('@serverless-cd/serverless-script/src/initialize');
  const initialize = new Initialize();
  await initialize.init();
  console.log('Initialize ends');
  res.send('');
});

module.exports = router;
