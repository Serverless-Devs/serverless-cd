const git = require('@serverless-cd/git-provider');
const { lodash: _ } = require('@serverless-cd/core');
const debug = require('debug')('serverless-cd:webhook');
const { WEBHOOK_URL, WEBHOOK_EVENTS, PROVIDER } = require('@serverless-cd/config');

async function add(owner, repo, access_token, secret, appId) {
  const provider = git(PROVIDER.GITHUB, { access_token });
  const webhooks = await provider.listWebhook({ owner, repo });
  const url = `${WEBHOOK_URL}?app_id=${appId}`;
  debug(`webhook url is ${url}`);
  debug(`webhooks is ${JSON.stringify(webhooks)}`);
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
    const provider = git(PROVIDER.GITHUB, { access_token });
    const webhooks = await provider.listWebhook({ owner, repo });
    const url = `${WEBHOOK_URL}?app_id=${appId}`;
    debug(`webhook url is ${url}`);
    for (const row of webhooks) {
      if (row.url === url) {
        debug(`remove webhook: ${JSON.stringify({ owner, repo, hook_id: row.id })}`);
        await provider.deleteWebhook({ owner, repo, hook_id: row.id });
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
