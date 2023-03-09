const appService = require('../services/application.service');
const gitService = require('../services/git.service');
const simpleGit = require('simple-git');

const execDir = './__tests__/tmp';
const provider = 'github';
const owner = 'heimanba';
const repo = 'cd-demo';

test('download express application', async () => {
  await appService.initTemplate({
    template: 'devsapp/start-express',
    parameters: {},
    execDir,
    appName: 'start-express',
  });
});

test('create repo and Webhook', async () => {
  await gitService.createRepoWithWebhook({
    owner,
    repo,
    token: 'xx',
    secret: '12345',
    appId: 'xxxx',
    provider,
  });
});

test('git init and commit', async () => {
  await gitService.initAndCommit({
    provider,
    execDir,
    repoUrl: `https://${provider}.com/${owner}/${repo}.git`,
    branch: 'master',
  });
});

test('git push', async () => {
  await gitService.pushFile({
    execDir,
    branch: 'master',
  });
});
