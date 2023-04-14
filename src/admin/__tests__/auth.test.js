const _ = require('lodash');
const { login, user } = require('./utile');

describe('Test user authentication', () => {
  test('GET /login', async () => {
    const { id, username, password } = await login();
    expect(_.isString(id)).toBeTruthy();
    expect(username).toBe(user.loginname);
    expect(password).toBeUndefined();
  });
});
