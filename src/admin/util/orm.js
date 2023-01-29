const Orm = require('@serverless-cd/ots-orm');
const { CREDENTIALS, OTS } = require('../config/env');

const OTS = {
  region: 'REGION',
  instanceName: 'OTS_INSTANCE_NAME',
};

const config = {
  ...CREDENTIALS,
  ...OTS,
};

module.exports = (tableName, tableIndex) => new Orm(config, tableName, tableIndex);
