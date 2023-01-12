const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}
const getRawBody = require('raw-body');
const { verifyLegitimacy, getProvider } = require('@serverless-cd/trigger');
const { customAlphabet } = require('nanoid');
const _ = require('lodash');
const { asyncInvoke } = require('./utils/invoke');
const { getRepoConfig } = require('./utils/repo');

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

const tryfun = async (fn, ...args) => {
  try {
    return await fn(...args);
  } catch (ex) {}
};

exports.handler = (req, resp, context) => {
  console.log('req.queries:: ', req.queries);
  const { app_id: appId } = req.queries || {};
  if (!appId) {
    console.log('Not a standard Serverless-cd trigger, lacks app_id');
    resp.statusCode = 400;
    resp.send(
      JSON.stringify({
        success: false,
        message: 'Not a standard Serverless-cd trigger, lacks app_id',
      }),
    );
    return;
  }
  getRawBody(req, async function (err, body) {
    if (err) {
      resp.statusCode = 400;
      resp.send(err.message);
      return;
    }

    try {
      const triggerInputs = {
        headers: req.headers,
        body: JSON.parse(body.toString()),
      };
      console.log('triggerInputs: ', JSON.stringify(triggerInputs));
      const provider = getProvider(triggerInputs);
      console.log('provider is: ', provider);
      const authorization = await getRepoConfig(provider, appId);
      const environment = _.get(authorization, 'environment', {});
      for (const key in environment) {
        const ele = environment[key];
        const eventConfig = _.get(ele, 'trigger_spec');
        eventConfig[provider].secret = _.get(authorization, 'webhook_secret');
        console.log('eventConfig: ', JSON.stringify(eventConfig));
        // 验证是否被触发
        const triggerConfig = await tryfun(verifyLegitimacy, eventConfig, triggerInputs);
        if (!_.get(triggerConfig, 'success')) {
          console.log(`env ${key} validate trigger failed`);
          continue;
        }
        console.log(`env ${key} validate trigger success`);
        console.log('triggerConfig: ', JSON.stringify(triggerConfig));
        const workerPayload = {
          taskId: nanoid(),
          cloneUrl: _.get(triggerConfig, 'data.url'),
          provider,
          event_name: _.get(triggerConfig, 'data.push') ? 'push' : 'pull_request',
          pusher: _.get(triggerConfig, 'data.pusher'),
          ref: _.get(triggerConfig, 'data.push.ref'),
          branch: _.get(triggerConfig, 'data.push.branch'),
          tag: _.get(triggerConfig, 'data.push.tag'),
          commit: _.get(triggerConfig, 'data.commit.id'),
          message: _.get(triggerConfig, 'data.commit.message'),
          authorization,
          envName: key,
          environment,
        };
        console.log('workerPayload:', JSON.stringify(workerPayload, null, 2));
        // 调用 worker
        try {
          await asyncInvoke(workerPayload);
        } catch (ex) {
          console.log(`invoke worker function error: ${ex}. Retry`);
          await asyncInvoke(workerPayload);
        }
      }

      resp.send(JSON.stringify(environment));
    } catch (ex) {
      resp.statusCode = 500;
      resp.send(ex.toString());
    }
  });
};
