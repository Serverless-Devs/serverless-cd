const router = require('express').Router();
const _ = require('lodash');
const { checkFile } = require('@serverless-cd/git');
const git = require('@serverless-cd/git-provider');
const debug = require('debug')('serverless-cd:provider-github');

const { Result, ValidationError } = require('../../../util');
const { PROVIDER, ADMIN_ROLE_KEYS, CD_PIPELINE_YAML } = require('../../../config/constants');
const auth = require('../../../middleware/auth');
const userService = require('../../../services/user.service');
const appService = require('../../../services/application.service');

/**
 * 组织信息
 */
router.get('/orgs', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  // 获取 owner 代码仓库的 token
  const result = await userService.getOrganizationOwnerIdByOrgId(req.orgId);
  const githubToken = _.get(result, `third_part.${PROVIDER.GITHUB}.access_token`, '');
  if (!githubToken) {
    throw new ValidationError(`没有找到${PROVIDER.GITHUB}.access_token`);
  }

  const provider = git(PROVIDER.GITHUB, { access_token: githubToken });
  const orgs = await provider.listOrgs();
  return res.json(Result.ofSuccess(orgs));
});

/**
 * 组织仓库信息
 */
router.get('/repos', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  const { orgId } = req;
  // 获取 owner 代码仓库的 token
  const ownerResult = await userService.getOrganizationOwnerIdByOrgId(orgId);
  const githubToken = _.get(ownerResult, `third_part.${PROVIDER.GITHUB}.access_token`, '');
  if (!githubToken) {
    throw new ValidationError(`没有找到${PROVIDER.GITHUB}.access_token`);
  }

  const applicationResult = await appService.listByOrgId(orgId);
  const applicationList = _.get(applicationResult, 'result', []);

  const provider = git(PROVIDER.GITHUB, { access_token: githubToken });
  const rows = await provider.listRepos();

  if (!_.isEmpty(applicationList)) {
    let mapRows = [];
    _.forEach(applicationList, (applicationItem) => {
      mapRows = _.map(rows, (item) => {
        item.disabled = item.id === Number(applicationItem.provider_repo_id);
        return item;
      });
    });
    return res.json(Result.ofSuccess(mapRows));
  }
  return res.json(Result.ofSuccess(rows));
});

/**
 * 分支信息
 */
router.get('/branches', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  // 获取 owner 代码仓库的 token
  const result = await userService.getOrganizationOwnerIdByOrgId(req.orgId);
  const githubToken = _.get(result, `third_part.${PROVIDER.GITHUB}.access_token`, '');
  if (!githubToken) {
    throw new ValidationError(`没有找到${PROVIDER.GITHUB}.access_token`);
  }

  const provider = git(PROVIDER.GITHUB, { access_token: githubToken });
  const rows = await provider.listBranches(req.query);
  return res.json(Result.ofSuccess(rows));
});

/**
 * 检测文件是否存在
 */
router.post('/checkFile', auth(ADMIN_ROLE_KEYS), async function (req, res) {
  // 获取 owner 代码仓库的 token
  const result = await userService.getOrganizationOwnerIdByOrgId(req.orgId);
  const githubToken = _.get(result, `third_part.${PROVIDER.GITHUB}.access_token`, '');
  if (!githubToken) {
    throw new ValidationError(`没有找到${PROVIDER.GITHUB}.access_token`);
  }

  const rows = await checkFile({ ...req.body, token: githubToken, file: CD_PIPELINE_YAML });
  return res.json(Result.ofSuccess(rows));
});

/**
 * 推送文件到仓库
 */
router.post('/putFile', auth(ADMIN_ROLE_KEYS), async function (req, res, _next) {
  // 获取 owner 代码仓库的 token
  const result = await userService.getOrganizationOwnerIdByOrgId(req.orgId);
  const githubToken = _.get(result, `third_part.${PROVIDER.GITHUB}.access_token`, '');
  if (!githubToken) {
    throw new ValidationError(`没有找到${PROVIDER.GITHUB}.access_token`);
  }

  const provider = git(PROVIDER.GITHUB, { access_token: githubToken });
  const rows = await provider.putFile(req.body);
  return res.json(Result.ofSuccess(rows));
});

module.exports = router;
