const _ = require('lodash');
const request = require("supertest");

const { url, login } = require('./utile');
const trackerPath = '/api/common/tracker';

describe("Test tracker", () => {
  let jwt;
  let username;
  beforeAll(async () => {
    const loginResult = await login();
    jwt = loginResult.jwt;
    username = loginResult.username;
  });

  test(`POST ${trackerPath}`, async () => {
    const resource1 = {
      uid: '1740298130743624',
      region: 'cn-hongkong',
      service: 'serverless-cd',
      function: 'test2',
    };
    const resource2 = {
      uid: '222222222',
      region: 'cn-hangzhou',
      service: 'hello-world-service',
      function: 'custom-cpp-event-function',
    };
    const resource3 = {
      uid: '1740298130743624',
      region: 'cn-hongkong',
      service: 'serverless-cd',
      function: 'test',
    };
    const payload = {
      platform: 'darwin', // 'app_center',
      name: 'git-action-test-1tpc', // app name
      orgName: username,
      status: 'success',
      // env: 'pre', // 默认是default
      resource: {
        fc: [resource1, resource3],
      },
    }
    let res = await request(url).post(trackerPath)
    .set('Cookie', [`jwt=${jwt}`])
    .send(payload)
    .expect(200);
    expect(_.get(res, 'body.success')).toBeTruthy();

    _.set(payload, 'resource.fc', [resource2, resource1]);
    res = await request(url).post(trackerPath)
    .set('Cookie', [`jwt=${jwt}`])
    .send(payload)
    .expect(200);
    expect(_.get(res, 'body.success')).toBeTruthy();
  })
});
