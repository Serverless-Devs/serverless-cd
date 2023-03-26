const request = require("supertest");
const { url, user } = require('./utile');

const _ = require('lodash');
const axios = require('axios');
const setCookie = require('set-cookie-parser');

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

exports.login = login;

describe("Test user authentication", () => {

});

describe("Test the application path", () => {
  test("GET /", async () => {
    await request(url).get("/").expect(200);
  });
});
