const _ = require('lodash');
const orgModel = require('../models/org.mode');
const appModel = require('../models/application.mode');

async function listByOrgName(orgName = '') {
  const { id: orgId } = await orgModel.getOwnerOrgByName(orgName);
  const data = await appModel.listAppByOwnerOrgId(orgId);
  if (_.isNil(data)) {
    return {};
  }
  return data;
}

module.exports = {
  listByOrgName,
};
