const { lodash: _ } = require('@serverless-cd/core');
const { setSession, ValidationError, generateErrorResult } = require('../util');
const { queryToken, updateActiveToken } = require('../routes/tokens/token.service');

module.exports = async function (req, res, next) {
  if (!_.isEmpty(req.headers.cd_token)) {
    // 根据 cd_token 查找 user 的信息，查不到就是异常 查到 就 next
    const { success, data, message } = await queryToken(req.headers.cd_token);
    if (!success) {
      throw new ValidationError(message);
    }
    // 记录登陆token时间
    await updateActiveToken(data.id);

    if (data.expire_time !== -1 && Date.now() > data.expire_time) {
      throw new ValidationError('token 已过期');
    }

    console.log('req.headers.cd_token:: ', req.headers.cd_token);
    setSession(req, { userId: data.user_id });
    next();
    return;
  }

  if (!req.session.userId && !req.url.startsWith('/api/auth')) {
    res.status(401).send(generateErrorResult("Unauthorized"));
  } else {
    next();
  }
}