const { customAlphabet } = require('nanoid');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const UID_TOKEN_UPPERCASE = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const tryFun = async (fn, ...args) => {
  try {
    return await fn(...args);
  } catch (ex) { }
};

module.exports = {
  prisma,
  tryFun,
  asyncInvoke: require('./invoke'),
  unionId: customAlphabet(UID_TOKEN_UPPERCASE, 16),
}
