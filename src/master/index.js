const getRawBody = require('raw-body');
const _ = require('lodash');
const { verifyLegitimacy, getProvider } = require('@serverless-cd/trigger');
const { nanoid, asyncInvoke, getAppConfig, ValidationError, SystemError, ignoreRunFunctionError } = require('./utils');

exports.handler = (req, resp) => {
  console.log('req.queries:: ', req.queries);
  const { app_id: appId } = req.queries || {};
  if (!appId) {
    const message = 'Not a standard Serverless-cd trigger, lacks app_id';
    return ValidationError(resp, message);
  }
  getRawBody(req, async function (err, body) {
    if (err) {
      return ValidationError(resp, err.message);
    }

    try {
      const triggerInputs = {
        headers: req.headers,
        body: JSON.parse(body.toString()),
      };
      // 通过输入获取厂商
      console.log('triggerInputs: ', JSON.stringify(triggerInputs));
      const provider = getProvider(triggerInputs);
      console.log('provider is: ', provider);
      // 获取应用的相关信息
      const authorization = await getAppConfig(provider, appId);
      const environment = _.get(authorization, 'environment', {});
      _.unset(authorization, 'environment');
      const taskId = nanoid();
      for (const key in environment) {
        const ele = environment[key];
        const eventConfig = _.get(ele, 'trigger_spec');
        eventConfig[provider].secret = _.get(authorization, 'webhook_secret');
        console.log('eventConfig: ', JSON.stringify(eventConfig));
        // 验证是否被触发
        const triggerConfig = await ignoreRunFunctionError(verifyLegitimacy, eventConfig, triggerInputs);
        if (!_.get(triggerConfig, 'success')) {
          console.log(`env ${key} validate trigger failed`);
          continue;
        }
        console.log(`env ${key} validate trigger success`);
        console.log('triggerConfig: ', JSON.stringify(triggerConfig));
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

      resp.send(JSON.stringify({ taskId, success: true, message: 'OK' }));
    } catch (ex) {
      SystemError(resp, ex);
    }
  });
};
