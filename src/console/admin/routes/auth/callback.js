const router = require("express").Router();
const axios = require("axios");
const { GITHUB } = require("../../config");
const _ = require("lodash");
const { doSession, md5Encrypt, generateErrorResult, generateSuccessResult, unionid, githubRequest } = require("../../util");
const { OTS_USER } = require('../../config');
const orm = require("../../util/orm")(OTS_USER.name, OTS_USER.index);

router.get("/github", async (req, res) => {
  const code = req.query.code;
  console.log("authorization code", code);
  const tokenResult = await axios({
    method: "post",
    url: "https://github.com/login/oauth/access_token",
    data: {
      client_id: GITHUB.clientId,
      client_secret: GITHUB.secret,
      code: code,
    },
    headers: {
      accept: "application/json",
    },
  });

  const login_token = _.get(tokenResult, "data.access_token");
  console.log("login_token", login_token);
  if (!login_token) {
    return res.json(generateErrorResult("授权失效或过期，请重新授权"));
  }
  const githubFetch = githubRequest(login_token);
  const userResult = await githubFetch("GET /user");
  const data = _.get(userResult, "data", {});
  console.log("user data", data);
  // 获取github Id 看是否存在
  const createdUser = await orm.find({ github_unionid: data.id });
  const findObj = _.find(createdUser.result, (item) => {
    return _.get(item, 'third_part.github.id', '') === data.id;
  });
  console.log("获取当前用户是否已存在", findObj);
  if (findObj) {
    //  如果存在，更新login_token
    await orm.update([{ id: findObj.id }], {
      third_part: {
        ...findObj.third_part,
        github: {
          ...(_.get(findObj, 'third_part.github', {})),
          login_token: login_token,
        }
      }
    });
    doSession(req, {
      userId: findObj.id,
      providerUid: data.id,
      login_token: login_token,
    });
    return res.json(generateSuccessResult({}, {status: 302}));
  }
  return res.json(generateSuccessResult({
      avatar: data.avatar_url,
      providerId: data.id,
      login_token: login_token,
      name: data.login
    }));
});

router.post("/bindingAccount", async function (req, res, next) {
  const {
    providerInfo: {
      providerId,
      login_token,
      avatar,
      name
    },
    username,
    password,
    status
  } = req.body;

  if (status === 'login') {
    const userResult = await orm.find({username: username});
    const userInfo = _.get(userResult, "result[0]", {});
    // 验证账号是否存在
    if (!_.isEmpty(userInfo)) {
      // 账号是否已被绑定
      if (_.get(userInfo, 'github_unionid', '')) {
        return res.json(generateErrorResult('绑定失败，该账号已被绑定'));
      }
      // 密码是否正确
      if (_.get(userInfo, 'password', '') === md5Encrypt(password)) {
        await orm.update([{ id: userInfo.id }], {
          avatar,
          github_unionid: providerId,
          third_part: {
            ...userInfo.third_part,
            github: {
              ...(_.get(userInfo, 'third_part.github', {})),
              id: providerId,
              username: name,
              login_token,
            }
          }
        });
        doSession(req, {
          userId: userInfo.id,
          providerUid: providerId,
          login_token
        });
        return res.json(generateSuccessResult());
      }
      return res.json(generateErrorResult('密码不正确'));
    }
    return res.json(generateErrorResult('用户不存在'))
  } else {
    // 否则创建login_token
    const id = unionid();
    await orm.create(
      [
        {
          id,
        },
      ],
      {
        username,
        avatar: avatar,
        github_unionid: providerId,
        password: md5Encrypt(password),
        third_part: {
          github: {
            id: providerId,
            login_token: login_token,
            owner: name
          }
        }
      }
    );
    doSession(req, {
      userId: id,
      providerUid: providerId,
      login_token,
    });
    return res.json(generateSuccessResult());
  }
})

module.exports = router;
