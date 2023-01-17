const { lodash: _ } = require('@serverless-cd/core');
const { Result, NoPermissionError } = require('../util');

const { queryToken, updateActiveToken } = require('../routes/tokens/token.service');
module.exports = async function (req, res, next) {
  if (!_.isEmpty(req.headers.cd_token)) {
    // 根据 cd_token 查找 user 的信息，查不到就是异常 查到 就 next
    const { success, data, message } = await queryToken(req.headers.cd_token);
    if (!success) {
      return res.json(Result.ofError(message, NoPermissionError));
    }
    if (data.expire_time !== -1 && Date.now() > data.expire_time) {
      return res.json(Result.ofError('token 已过期', NoPermissionError));
    }
    // 记录登陆token时间
    await updateActiveToken(data.id);
    req.userId = data.user_id;
    next();
  } else{
    next();
  }
};
