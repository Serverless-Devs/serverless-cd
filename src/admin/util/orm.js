const Orm = require('@serverless-cd/ots-orm');
const { CREDENTIALS } = require('@serverless-cd/config');

const OTS = {
  region: 'REGION',
  instanceName: 'OTS_INSTANCE_NAME',
};

const config = {
  ...CREDENTIALS,
  ...OTS,
};

module.exports = (tableName, tableIndex) => new Orm(config, tableName, tableIndex);
