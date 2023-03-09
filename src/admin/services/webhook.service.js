const git = require('@serverless-cd/git-provider');
const { verifyLegitimacy, getProvider } = require('@serverless-cd/trigger');
const { lodash: _ } = require('@serverless-cd/core');
const debug = require('debug')('serverless-cd:webhook');
const { WEBHOOK_EVENTS } = require('@serverless-cd/config');
const { Webhook, ValidationError, unionId } = require('../util');

const dispatchService = require('./dispatch.service');
const appModel = require('../models/application.mode');
const orgModel = require('../models/org.mode');

const ignoreRunFunctionError = async (fn, ...args) => {
  try {
    return await fn(...args);
  } catch (ex) {}
};

async function add({ owner, repo, token: access_token, webHookSecret: secret, appId, provider }) {
  const providerClient = git(provider, { access_token });
  const webhooks = await providerClient.listWebhook({ owner, repo });
  const url = Webhook.getUrl(appId);
  debug(`webhook url is ${url}`);
  debug(`webhooks is ${JSON.stringify(webhooks)}`);
  for (const row of webhooks) {
    if (row.url === url) {
      await providerClient.updateWebhook({
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
  return await providerClient.createWebhook({ owner, repo, url, secret, events: WEBHOOK_EVENTS });
}

async function remove({ owner, repo_name: repo, token: access_token, appId, provider }) {
  try {
    const providerClient = git(provider, { access_token });
    const webhooks = await providerClient.listWebhook({ owner, repo });
    const url = Webhook.getUrl(appId);
    debug(`webhook url is ${url}`);
    for (const row of webhooks) {
      if (row.url === url) {
        debug(`remove webhook: ${JSON.stringify({ owner, repo, hook_id: row.id })}`);
        await providerClient.deleteWebhook({ owner, repo, hook_id: row.id });
        return;
      }
    }
  } catch (ex) {
    console.error('remove webhook error: ', ex);
  }
}

async function triggered(appId, headers, body) {
  debug(`webhook headers: ${JSON.stringify(headers)}, body: ${JSON.stringify(body)}`);
  const triggerInputs = { headers, body };
  // 通过输入获取厂商
  const provider = getProvider(triggerInputs);
  debug(`provider is: ${provider}`);

  // 获取应用的相关信息
  const applicationResult = await appModel.getAppById(appId);
  if (_.isEmpty(applicationResult)) {
    throw new ValidationError('没有查到应用信息');
  }
  const {
    owner_org_id: ownerOrgId,
    environment = {},
    webhook_secret,
    owner = '',
    secrets = {},
  } = applicationResult;
  const orgResult = await orgModel.getOrgById(ownerOrgId);
  const accessToken = _.get(orgResult, `third_part.${provider}.access_token`, '');
  if (_.isEmpty(accessToken)) {
    throw new Error(`${provider} authorization is invalid`);
  }

  const taskId = unionId();

  for (const key in environment) {
    const ele = environment[key];
    const eventConfig = _.get(ele, 'trigger_spec');
    eventConfig[provider].secret = webhook_secret;
    debug(`${key} eventConfig: ${JSON.stringify(eventConfig)}`);
    // 验证是否被触发
    const triggerConfig = await ignoreRunFunctionError(
      verifyLegitimacy,
      eventConfig,
      triggerInputs,
    );
    if (!_.get(triggerConfig, 'success')) {
      console.log(`env ${key} validate trigger failed`);
      continue;
    }
    debug(`env ${key} validate trigger success`);
    debug(`triggerConfig:\n${JSON.stringify(triggerConfig)}`);
    const workerPayload = {
      taskId,
      cloneUrl: _.get(triggerConfig, 'data.url'),
      provider,
      event_name: _.get(triggerConfig, 'data.push') ? 'push' : 'pull_request',
      pusher: _.get(triggerConfig, 'data.pusher'),
      ref: _.get(triggerConfig, 'data.push.ref'),
      branch: _.get(triggerConfig, 'data.push.branch'),
      tag: _.get(triggerConfig, 'data.push.tag'),
      commit: _.get(triggerConfig, 'data.commit.id'),
      message: _.get(triggerConfig, 'data.commit.message'),
      authorization: {
        appId,
        accessToken,
        dispatchOrgId: ownerOrgId, // 如果是 webhook 触发则传递ownerOrgId
        secrets,
        owner,
        webhook_secret,
      },
      envName: key,
      environment,
    };
    debug(`workerPayload:\n${JSON.stringify(workerPayload, null, 2)}`);
    // 调用 worker
    const asyncInvokeRes = await dispatchService.invokeFunction(workerPayload);
    return {
      'x-fc-request-id': _.get(asyncInvokeRes, 'headers[x-fc-request-id]'),
      taskId: workerPayload.taskId,
    };
  }
}

module.exports = {
  add,
  remove,
  triggered,
};
