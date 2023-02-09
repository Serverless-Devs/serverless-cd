const _ = require('lodash');
const accountModel = require('../models/account.mode');

async function getOrgById(orgId = '') {
  if (_.isEmpty(orgId)) {
    return {};
  }
  const data = await accountModel.getOrgById(orgId);
  if (_.isNil(data)) {
    return {};
  }
  return data;
}

module.exports = {
  getOrgById,
};
