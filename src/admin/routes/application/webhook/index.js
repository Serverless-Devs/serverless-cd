const git = require('@serverless-cd/git-provider');
const { lodash: _ } = require('@serverless-cd/core');
const { WEBHOOKURL: url } = require('../../../config');

async function add(owner, repo, access_token, secret, appId) {
  const prioverd = git('github', { access_token });
  const webhooks = await prioverd.listWebhook({ owner, repo });
  const u = `${url}?app_id=${appId}`;
  for (const row of webhooks) {
    if (row.url === u) {
      console.log('update webhook, id: ', row.id);
      await prioverd.updateWebhook({ owner, repo, url: u, secret, hook_id: row.id });
      return;
    }
  }
  return await prioverd.createWebhook({ owner, repo, url: u, secret });
}

async function remove(owner, repo, access_token, appId) {
  try {
    const prioverd = git('github', { access_token });
    const webhooks = await prioverd.listWebhook({ owner, repo });
    const u = `${url}?app_id=${appId}`;
    for (const row of webhooks) {
      if (row.url === u) {
        console.log('remove webhook, id: ', row.id);
        await prioverd.deleteWebhook({ owner, repo, url: u, hook_id: row.id });
        return;
      }
    }
  } catch (ex) {
    console.error('remove webhook error: ', ex);
  }
}

module.exports = {
  add,
  remove,
};
