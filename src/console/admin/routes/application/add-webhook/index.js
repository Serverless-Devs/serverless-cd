const git = require('@serverless-cd/git-provider');
const { lodash: _ } = require('@serverless-cd/core');
const { WEBHOOKURL: url } = require('../../../config');

async function run(owner, repo, access_token, secret, userId) {
  const prioverd = git('github', { access_token });
  const webhooks = await prioverd.listWebhook({ owner, repo });
  const u = `${url}?user_id=${userId}`;
  for (const row of webhooks) {
    if (row.url === u) {
      console.log('update webhook, id: ', row.id);
      await prioverd.updateWebhook({ owner, repo, url: u, secret, hook_id: row.id });
      return;
    }
  }
  return await prioverd.createWebhook({ owner, repo, url: u, secret });
}

module.exports = run;
