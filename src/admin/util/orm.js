const Orm = require('@serverless-cd/ots-orm');
const { CREDENTIALS, OTS } = require('../config');

const config = {
  ...CREDENTIALS,
  ...OTS,
};

module.exports = (tableName, tableIndex) => new Orm(config, tableName, tableIndex);