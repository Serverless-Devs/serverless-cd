const router = require('express').Router();
const _ = require('lodash');
const { checkFile } = require('@serverless-cd/git');
const git = require('@serverless-cd/git-provider');
const debug = require('debug')('serverless-cd:provider-github');

const { Result, ValidationError } = require('../../../util');
const { PROVIDER, ADMIN_ROLE_KEYS, CD_PIPELINE_YAML } = require('@serverless-cd/config');
const auth = require('../../../middleware/auth');
const gitService = require('../../../services/git.service');
const userService = require('../../../services/user.service');
const appService = require('../../../services/application.service');

/**
 * 组织信息
 */
router.get('/orgs', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const orgs = await gitService.getProviderOrgs(req.orgId, PROVIDER.GITHUB);
  return res.json(Result.ofSuccess(orgs));
});

/**
 * 用户仓库信息
 */
router.get('/repos', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const rows = await gitService.getProviderRepos(req.orgId, PROVIDER.GITHUB);
  return res.json(Result.ofSuccess(rows));
});

/**
 * 组织的仓库信息
 */
router.get('/orgRepos', auth(ADMIN_ROLE_KEYS), async function (req, res, _next) {
  const rows = await gitService.getProviderRepos(req.orgId, PROVIDER.GITHUB, req.query);
  return res.json(Result.ofSuccess(rows));
});

/**
 * 分支信息
 */
router.get('/branches', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const rows = await gitService.getBranches(req.orgId, PROVIDER.GITHUB, req.query);
  return res.json(Result.ofSuccess(rows));
});

/**
 * 检测文件是否存在
 */
router.post('/checkFile', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const result = await gitService.checkProviderFile(req.orgId, PROVIDER.GITHUB, req.body);
  return res.json(Result.ofSuccess(result));
});

/**
 * 推送文件到仓库
 */
router.post('/putFile', auth(ADMIN_ROLE_KEYS), async function (req, res, _next) {
  const result = await gitService.putFile(req.orgId, PROVIDER.GITHUB, req.body);
  return res.json(Result.ofSuccess(result));
});

module.exports = router;
