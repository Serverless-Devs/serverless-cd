const router = require('express').Router();
const git = require('@serverless-cd/git-provider');
const { checkFile } = require('@serverless-cd/git');
const { lodash: _ } = require('@serverless-cd/core');
const { OTS_USER, OTS_APPLICATION, CD_PIPLINE_YAML } = require('../config');
const { generateSuccessResult } = require('../util');
const orm = require('../util/orm')(OTS_USER.name, OTS_USER.index);
const applicationOrm = require('../util/orm')(OTS_APPLICATION.name, OTS_APPLICATION.index);

router.get('/repos', async function (req, res, _next) {
  const userResult = await orm.find({ id: req.session.userId });
  const applicationResult = await applicationOrm.find({ user_id: req.session.userId });
  const applicationList = _.get(applicationResult, 'result', []);
  const useGithubToken = _.get(userResult, 'result[0].third_part.github.access_token', '');

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
    return res.json(generateSuccessResult(mapRows));
  }
  return res.json(generateSuccessResult(rows));
});

router.get('/orgs', async function (req, res, _next) {
  const userResult = await orm.find({ id: req.session.userId });
  const useGithubToken = _.get(userResult, 'result[0].third_part.github.access_token', '');
  const prioverd = git('github', { access_token: useGithubToken });
  const orgs = await prioverd.listOrgs();
  return res.json(generateSuccessResult(orgs));
});

router.get('/orgRepos', async function (req, res, _next) {
  const userResult = await orm.find({ id: req.session.userId });
  console.log('orgRepos req.query', JSON.stringify(req.query));
  const { org } = req.query;
  const applicationResult = await applicationOrm.find({ user_id: req.session.userId });
  const applicationList = _.get(applicationResult, 'result', []);
  const useGithubToken = _.get(userResult, 'result[0].third_part.github.access_token', '');

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
    console.log('orgRepos response:', mapRows);
    return res.json(generateSuccessResult(mapRows));
  }
  console.log('orgRepos response:', rows);
  return res.json(generateSuccessResult(rows));
});

router.get('/branches', async function (req, res, _next) {
  const userResult = await orm.find({ id: req.session.userId });
  const useGithubToken = _.get(userResult, 'result[0].third_part.github.access_token', '');

  const prioverd = git('github', { access_token: useGithubToken });
  const rows = await prioverd.listBranches(req.query);
  return res.json(generateSuccessResult(rows));
});

router.post('/putFile', async function (req, res, _next) {
  const userResult = await orm.find({ id: req.session.userId });
  const useGithubToken = _.get(userResult, 'result[0].third_part.github.access_token', '');

  const prioverd = git('github', { access_token: useGithubToken });
  const rows = await prioverd.putFile(req.body);
  return res.json(generateSuccessResult(rows));
});

router.post('/checkFile', async function (req, res, _next) {
  console.log('checkFile body:', req.body);
  const userResult = await orm.find({ id: req.session.userId });
  const useGithubToken = _.get(userResult, 'result[0].third_part.github.access_token', '');
  const rows = await checkFile({ ...req.body, token: useGithubToken, file: CD_PIPLINE_YAML });
  return res.json(generateSuccessResult(rows));
});

module.exports = router;
