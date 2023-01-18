const router = require('express').Router();
const axios = require('axios');
const { GITHUB } = require('../../config/config');
const _ = require('lodash');
const { md5Encrypt, ValidationError, Result, unionid, githubRequest } = require('../../util');
const userModel = require('../../models/account.mode');

router.get('/github', async (req, res) => {
  const code = req.query.code;
  const tokenResult = await axios({
    method: 'post',
    url: 'https://github.com/login/oauth/access_token',
    data: {
      client_id: GITHUB.clientId,
      client_secret: GITHUB.secret,
      code: code,
    },
    headers: {
      accept: 'application/json',
    },
  });

  const login_token = _.get(tokenResult, 'data.access_token');
  if (!login_token) {
    throw new ValidationError('授权失效或过期，请重新授权');
  }
  const githubFetch = githubRequest(login_token);
  const userResult = await githubFetch('GET /user');
  const data = _.get(userResult, 'data', {});
  // 获取github Id 看是否存在
  const result = await userModel.getUserByGithubUid(data.id);
  const userInfo = _.find(result, (item) => {
    return _.get(item, 'third_part.github.id', '') === data.id;
  });
  if (userInfo) {
    const userId = userInfo.id;
    //  如果存在，更新login_token
    await userModel.updateUserById(userId, {
      third_part: {
        ...userInfo.third_part,
        github: {
          ..._.get(userInfo, 'third_part.github', {}),
          login_token: login_token,
        },
      },
    });
    req.userId = userId;
    return res.json(Result.ofSuccess({}, 302));
  }
  return res.json(
    Result.ofSuccess({
      avatar: data.avatar_url,
      providerId: data.id,
      login_token: login_token,
      name: data.login,
    }),
  );
});

router.post('/bindingAccount', async function (req, res, next) {
  const {
    providerInfo: { providerId, login_token, avatar, name },
    username,
    password,
    status,
  } = req.body;

  if (status === 'login') {
    const userInfo = await userModel.getUserByName(username);
    // 验证账号是否存在
    if (!_.isEmpty(userInfo)) {
      // 账号是否已被绑定
      if (_.get(userInfo, 'github_unionid', '')) {
        throw new ValidationError('绑定失败，该账号已被绑定');
      }
      // 密码是否正确
      if (_.get(userInfo, 'password', '') === md5Encrypt(password)) {
        await userModel.updateUserById(userInfo.id, {
          avatar,
          github_unionid: providerId,
          third_part: {
            ...userInfo.third_part,
            github: {
              ..._.get(userInfo, 'third_part.github', {}),
              id: providerId,
              username: name,
              login_token,
            },
          },
        });
        req.userId = userInfo.id;
        return res.json(Result.ofSuccess());
      }
      throw new ValidationError('密码不正确');
    }
    throw new ValidationError('用户不存在');
  } else {
    // 否则创建login_token
    const { id } = await userModel.createUser({
      username,
      avatar: avatar,
      github_unionid: providerId,
      password: md5Encrypt(password),
      third_part: {
        github: {
          id: providerId,
          login_token: login_token,
          owner: name,
        },
      },
    });
    req.userId = id;
    return res.json(Result.ofSuccess());
  }
});

module.exports = router;
