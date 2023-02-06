const { customAlphabet } = require('nanoid');
const { UID_TOKEN_UPPERCASE } = require('@serverless-cd/config');

const ignoreRunFunctionError = async (fn, ...args) => {
  try {
    return await fn(...args);
  } catch (ex) { }
};

module.exports = {
  ...require('./custom-error'),
  ...require('./invoke'),
  getAppConfig: require('./get-app-config'),
  ignoreRunFunctionError,
  nanoid: customAlphabet(UID_TOKEN_UPPERCASE, 40),
}
