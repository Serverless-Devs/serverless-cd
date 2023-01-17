const router = require('express').Router();
const git = require('@serverless-cd/git-provider');
const { checkFile } = require('@serverless-cd/git');
const { lodash: _ } = require('@serverless-cd/core');
const { OTS_APPLICATION, CD_PIPLINE_YAML } = require('../../config');
const { Result } = require('../../util');
const userModel = require('../../model/account.mode');
const applicationOrm = require('../../util/orm')(OTS_APPLICATION.name, OTS_APPLICATION.index);

router.get('/repos', async function (req, res, _next) {
  const userResult = await userModel.getUserById(req.userId);
  const applicationResult = await applicationOrm.find({ user_id: req.userId });
  const applicationList = _.get(applicationResult, 'result', []);
  const useGithubToken = _.get(userResult, 'third_part.github.access_token', '');

  const prioverd = git('github', { access_token: useGithubToken });
  const rows = await prioverd.listRepos();

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

router.get('/orgs', async function (req, res, _next) {
  const result = await userModel.getUserById(req.userId);
  const useGithubToken = _.get(result, 'third_part.github.access_token', '');
  const prioverd = git('github', { access_token: useGithubToken });
  const orgs = await prioverd.listOrgs();
  return res.json(Result.ofSuccess(orgs));
});

router.get('/orgRepos', async function (req, res, _next) {
  const result = await userModel.getUserById(req.userId);
  const { org } = req.query;
  const applicationResult = await applicationOrm.find({ user_id: req.userId });
  const applicationList = _.get(applicationResult, 'result', []);
  const useGithubToken = _.get(result, 'third_part.github.access_token', '');

  const prioverd = git('github', { access_token: useGithubToken });
  const rows = await prioverd.listOrgRepos(org);

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

router.get('/branches', async function (req, res, _next) {
  const result = await userModel.getUserById(req.userId);
  const useGithubToken = _.get(result, 'third_part.github.access_token', '');

  const prioverd = git('github', { access_token: useGithubToken });
  const rows = await prioverd.listBranches(req.query);
  return res.json(Result.ofSuccess(rows));
});

router.post('/putFile', async function (req, res, _next) {
  const result = await userModel.getUserById(req.userId);
  const useGithubToken = _.get(result, 'third_part.github.access_token', '');

  const prioverd = git('github', { access_token: useGithubToken });
  const rows = await prioverd.putFile(req.body);
  return res.json(Result.ofSuccess(rows));
});

router.post('/checkFile', async function (req, res, _next) {
  const result = await userModel.getUserById(req.userId);
  const useGithubToken = _.get(result, 'third_part.github.access_token', '');
  const rows = await checkFile({ ...req.body, token: useGithubToken, file: CD_PIPLINE_YAML });
  return res.json(Result.ofSuccess(rows));
});

module.exports = router;
