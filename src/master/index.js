const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}
const getRawBody = require('raw-body');
const { verifyLegitimacy } = require('@serverless-cd/trigger');
const { checkFile } = require('@serverless-cd/git');
const { customAlphabet } = require('nanoid');
const _ = require('lodash');
const getTriggerEvent = require('./utils/get-trigger-event');
const { asyncInvoke } = require('./utils/invoke');
const getWorkerInputs = require('./utils/get-worker-inputs');
const { CD_PIPLINE_YAML } = require('./config');

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

exports.handler = (req, resp, context) => {
  console.log('req.queries:: ', req.queries);
  const { app_id: appId } = req.queries || {};
  if (!appId) {
    console.log('Not a standard Serverless-cd trigger, lacks app_id');
    resp.statusCode = 400;
    resp.send(JSON.stringify({
      success: false,
      message: 'Not a standard Serverless-cd trigger, lacks app_id',
    }));
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

      // 处理触发方式的逻辑
      const interceptor = getTriggerEvent(triggerInputs, context);
      console.log('interceptor is: ', interceptor);
      if (!_.has(getWorkerInputs, interceptor)) {
        throw new Error(`Unrecognized interceptor: ${interceptor}`);
      }

      // 组装 worker 函数需要的参数
      // 验证 user 下是否存在这个仓库应用
      const workerPayload = await getWorkerInputs[interceptor](triggerInputs, appId);
      const eventConfig = _.get(workerPayload, 'authorization.trigger_spec');

      // 验证是否被触发
      console.log("eventConfig: ", JSON.stringify(eventConfig));
      console.log("triggerInputs: ", JSON.stringify(triggerInputs));
      const triggerConfig = await verifyLegitimacy(eventConfig, triggerInputs);
      console.log('triggerConfig: ', JSON.stringify(triggerConfig));
      if (!_.get(triggerConfig, 'success')) {
        resp.send(JSON.stringify(triggerConfig));
        return;
      }
      const pipLineYaml = _.get(triggerConfig, 'trigger.template', CD_PIPLINE_YAML);
      _.merge(workerPayload, { trigger: triggerConfig.trigger, taskId: nanoid() });
      console.log('workerPayload:', JSON.stringify(workerPayload, null, 2));

      // 验证 pipline 文件是否存在
      const checkFilePayload = {
        file: pipLineYaml,
        clone_url: workerPayload.cloneUrl,
        ref: workerPayload.ref,
        owner: _.get(workerPayload, 'authorization.owner'),
        provider: _.get(workerPayload, 'provider'),
        token: _.get(workerPayload, 'authorization.accessToken'),
      };
      console.log('Check file payload: ', checkFilePayload);
      if (!(await checkFile(checkFilePayload))) {
        resp.send(JSON.stringify({
          success: false,
          message: `Not found config file: ${pipLineYaml}`,
        }));
        return;
      }

      // 调用 worker
      try {
        await asyncInvoke(workerPayload);
      } catch (ex) {
        console.log(`invoke worker function error: ${ex}. Retry`);
        await asyncInvoke(workerPayload);
      }

      resp.send(JSON.stringify(triggerConfig));
    } catch (ex) {
      resp.statusCode = 500;
      resp.send(ex.toString())
    }
  });
}