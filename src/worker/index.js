const path = require('path');
const fse = require('fs-extra');
const envPath = path.join(__dirname, '..', '..', '.env');
if (fse.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}
const core = require("@serverless-cd/core");
const checkout = require("@serverless-cd/git").default;
const _ = require('lodash');
const Engine = require("@serverless-cd/engine").default;
const { CODE_DIR, CD_PIPLINE_YAML, CREDENTIALS, OSS_CONFIG } = require('./config');
const { getPayload, getOTSTaskPayload } = require('./utils');
const otsTask = require('./model/task');
const otsApp = require('./model/app');

async function handler (event, _context, callback) {
  // 解析入参
  const inputs = getPayload(event);
  console.log(JSON.stringify(inputs, null, 2));
  const {
    taskId,
    provider,
    cloneUrl,
    authorization: {
      userId,
      owner,
      appId,
      accessToken: token,
      secrets,
    } = {},
    ref,
    commit,
    message,
    execDir = CODE_DIR,
    event_name,
    trigger,
    customInputs = {},
  } = inputs;

  const logPrefix = `/logs/${taskId}`;
  fse.emptyDirSync(logPrefix);
  console.log('start task, uuid: ', taskId);

  // 拉取代码
  console.log('checkout start');
  await checkout({
    token,
    provider,
    logger: console,
    owner,
    clone_url: cloneUrl,
    execDir,
    ref,
    commit,
  });
  console.log('checkout success');

  // 解析 pipline
  const pipLineYaml = path.join(execDir, _.get(trigger, 'template', CD_PIPLINE_YAML))
  console.info(`parse spec: ${pipLineYaml}`);
  core.setServerlessCdVariable('TEMPLATE_PATH', pipLineYaml);
  const piplineContext = await core.parseSpec();
  console.log('piplineContext:\n', JSON.stringify(piplineContext));

  // 启动 engine
  const appTaskConfig = { taskId, commit, message, ref };
  const steps = _.get(piplineContext, 'steps');
  const engine = new Engine({
    cwd: execDir,
    steps,
    logConfig: {
      logPrefix,
      ossConfig: {
        ...CREDENTIALS,
        ...OSS_CONFIG,
      },
      // logLevel: 'debug',
    },
    inputs: {
      ...customInputs,
      task_id: taskId, // 函数计算的异步任务ID
      app: { // 应用的关联配置
        owner,
        user_id: userId,
        id: appId,
      },
      secrets,
      git: { // git 相关的内容
        provider, // 托管仓库
        clone_url: cloneUrl, // git 的 url 地址
        ref,
        commit,
        event_name, // 触发的事件名称
      },
      trigger, // 触发 pipline 的配置
    },
    events: {
      onInit: async (context) => {
        console.log('start');
        await otsApp.update(appId, { latest_task: { ...appTaskConfig, completed: context.completed, status: context.status } });
      },
      onPreRun: async function (_data, context) {
        await otsTask.update(taskId, {
          status: context.status,
          steps: getOTSTaskPayload(context.steps), 
        });
      },
      onPostRun: async function (_data, context) {
        await otsTask.update(taskId, {
          status: context.status,
          steps: getOTSTaskPayload(context.steps), 
        });
      },
      onCompleted: async function (context) {
        await otsTask.update(taskId, {
          status: context.status,
          steps: getOTSTaskPayload(context.steps),
        });
        await otsApp.update(appId, { latest_task: { ...appTaskConfig, completed: context.completed, status: context.status }});
        console.log('completed end.');
        callback(null, '');
      },
    },
  });

  console.log('ots task init');
  // init task 表
  // 思考：如果支持异步重拾，是否 retry 的时候一定失败
  await otsTask.create(taskId, {
    user_id: userId,
    app_id: appId,
    status: engine.context.status,
    steps: getOTSTaskPayload(engine.context.steps), 
    trigger_payload: inputs,
  });
  console.log('ots app update');
  // 防止有其他的动作，将等待状态也要set 到 ots
  await otsApp.update(appId, { latest_task: { ...appTaskConfig, completed: engine.context.completed, status: engine.context.status } })

  console.log('engine run start');
  await engine.start();
}

exports.handler = handler;
