const customErrors = require('./custom-errors');
const util = require('./util');
const Result = require('./result');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  ...customErrors,
  ...util,
  Result,
  prisma,
  getModel(otsModel, prismaModel) {
    return process.env.DATABASE_URL ? prismaModel : otsModel;
  },
};
