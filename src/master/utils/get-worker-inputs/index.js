const github = require('./github');
const constants = require('../constants');

module.exports = {
  [constants.PROVIDER_GITHUB]: github,
};
