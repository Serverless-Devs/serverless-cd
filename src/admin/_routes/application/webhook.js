const git = require('@serverless-cd/git-provider');
const { lodash: _ } = require('@serverless-cd/core');
const { WEBHOOKURL, WEBHOOK_EVENTS } = require('../../config/config');

async function add(owner, repo, access_token, secret, appId) {
  const provider = git('github', { access_token });
  const webhooks = await provider.listWebhook({ owner, repo });
  const url = `${WEBHOOKURL}?app_id=${appId}`;
  for (const row of webhooks) {
    if (row.url === url) {
      await provider.updateWebhook({
        owner,
        repo,
        url,
        secret,
        hook_id: row.id,
        events: WEBHOOK_EVENTS,
      });
      return;
    }
  }
  return await provider.createWebhook({ owner, repo, url, secret, events: WEBHOOK_EVENTS });
}

async function remove(owner, repo, access_token, appId) {
  try {
    const provider = git('github', { access_token });
    const webhooks = await provider.listWebhook({ owner, repo });
    const url = `${WEBHOOKURL}?app_id=${appId}`;
    for (const row of webhooks) {
      if (row.url === url) {
        await provider.deleteWebhook({ owner, repo, url, hook_id: row.id });
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
