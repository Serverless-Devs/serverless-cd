const customErrors = require('./custom-errors');
const util = require('./util');
const Result = require('./result');
const Client = require('./client');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  ...customErrors,
  ...util,
  Result,
  prisma,
  Client,
};
