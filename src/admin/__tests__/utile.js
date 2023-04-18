require('dotenv').config({
  path: require('path').join(__dirname, '.env'),
});
const request = require('supertest');
const _ = require('lodash');
const setCookie = require('set-cookie-parser');

const url = 'http://0.0.0.0:9000';
const user = {
  loginname: 'wss',
  password: 'q`1234',
};

const login = async () => {
  const res = await request(url).post('/api/auth/login').send(user).expect(200);

  const cookies = setCookie.parse(res);
  const { value: jwt } = _.find(cookies, ['name', 'jwt']);
  expect(_.get(res, 'body.success')).toBe(true);

  const data = _.get(res, 'body.data', {});
  return {
    jwt,
    ...data,
  };
};

module.exports = {
  url,
  user,
  login,
};
