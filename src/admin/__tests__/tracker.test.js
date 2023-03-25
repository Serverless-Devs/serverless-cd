const _ = require('lodash');
const axios = require('axios');
const setCookie = require('set-cookie-parser');

const url = 'http://0.0.0.0:9000';

const login = async () => {
  const res = await axios.post(`${url}/api/auth/login`, {
    loginname: "wss",
    password: "q`1234",
  });
  const cookies = setCookie.parse(res);
  const { value: jwt } = _.find(cookies, ['name', 'jwt']);
  return {
    jwt,
    ...res.data,
  }
};

const tracker = async (jwt) => {
  const payload = {
    source: 'aliyunAppCenter',
    resource: {
      "aliyun.fc": {
        "uid": "1920014488718015",
        "region": "cn-hangzhou",
        "functions": [
          {
            "name": "start-egg",
            "service": "web-framework",
          },
          {
            "name": "start-egg1",
            "service": "web-framework2",
          }
        ]
      }
    },
    action: 1, // 0 删除，1 新增
    status: 'success', // 成功 ｜ 失败
    appId: '4c8nrkx0h35ry0vg',
    envName: 'default',
  }
  const res = await axios.post(`${url}/api/common/tracker`, payload, {
    withCredentials: true,
    headers: {
      "Cookie": `jwt=${jwt}`
    },
  })
  console.log(res.data);
}

// (async () => {
//   const { jwt } = await login();
//   await tracker(jwt);
//   // const res = await axios.get(`${url}/api/user/info`, {
//   //   withCredentials: true,
//   //   headers: {
//   //     "Cookie": `jwt=${jwt}`
//   //   },
//   // })
//   // console.log(res.data);
// })()
