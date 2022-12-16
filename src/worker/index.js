const path = require('path');
const fse = require('fs-extra');
const envPath = path.join(__dirname, '..', '..', '.env');
if (fse.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}
const core = require("@serverless-cd/core");
const checkout = require("@serverless-cd/git").default;
const Setup = require("@serverless-cd/setup-runtime").default;
const _ = require('lodash');
const Engine = require("@serverless-cd/engine").default;
const { DOMAIN, REGION, CODE_DIR, CD_PIPLINE_YAML, CREDENTIALS, OSS_CONFIG, DEFAULT_UNSET_ENVS } = require('./config');
const { getPayload, getOTSTaskPayload } = require('./utils');
const otsTask = require('./model/task');
const otsApp = require('./model/app');

async function handler(event, _context, callback) {
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
    branch,
    tag,
    execDir = CODE_DIR,
    event_name,
    trigger,
    customInputs = {},
  } = inputs;

  const logPrefix = `/logs/${taskId}`;
  fse.emptyDirSync(logPrefix);
  console.log('start task, uuid: ', taskId);

  // 拉取代码
  const onInit = async (context, logger) => {
    logger.info('onInit: checkout start');
    logger.debug(`start checkout code, taskId: ${taskId}`);
    await checkout({
      token,
      provider,
      logger,
      owner,
      clone_url: cloneUrl,
      execDir,
      ref,
      commit,
    });
    logger.info('checkout success');

    // 解析 pipline
    const pipLineYaml = path.join(execDir, _.get(trigger, 'template', CD_PIPLINE_YAML));
    logger.info(`parse spec: ${pipLineYaml}`);
    const piplineContext = await core.parseSpec(pipLineYaml);
    logger.debug(`piplineContext:: ${JSON.stringify(piplineContext)}`);
    const steps = _.get(piplineContext, 'steps');
    logger.debug(`start update app`);
    await otsApp.update(appId, { latest_task: { ...appTaskConfig, completed: context.completed, status: context.status } });
    logger.debug(`start update app success`);

    const runtimes = _.get(piplineContext, 'runtimes', []);
    logger.info(`start init runtime: ${runtimes}`);
    const setup = new Setup({
      runtimes,
      credentials: CREDENTIALS,
      region: REGION,
    });
    await setup.run();
    logger.info(`init runtime success`);

    return { steps };
  }

  // 启动 engine
  const appTaskConfig = { taskId, commit, message, ref };

  const engine = new Engine({
    cwd: execDir,
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
      task: {
        id: taskId,
        url: `${DOMAIN}/application/${userId}/detail/${taskId}`,
      },
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
        branch,
        message,
        tag,
        event_name, // 触发的事件名称
      },
      trigger, // 触发 pipline 的配置
    },
    events: {
      onInit,
      onPreRun: async function (_data, context) {
        await otsTask.make(taskId, {
          status: context.status,
          steps: getOTSTaskPayload(context.steps),
        });
      },
      onPostRun: async function (_data, context) {
        await otsTask.make(taskId, {
          status: context.status,
          steps: getOTSTaskPayload(context.steps),
        });
      },
      onCompleted: async function (context, logger) {
        await otsTask.make(taskId, {
          status: context.status,
          steps: getOTSTaskPayload(context.steps),
        });
        await otsApp.update(appId, { latest_task: { ...appTaskConfig, completed: context.completed, status: context.status } });
        logger.info('completed end.');
        callback(null, '');
      },
    },
    unsetEnvs: DEFAULT_UNSET_ENVS,
  });

  console.log('ots task init');
  // init task 表
  await otsTask.make(taskId, {
    user_id: userId,
    app_id: appId,
    status: engine.context.status,
    trigger_payload: inputs,
  });
  console.log('ots app update');
  // 防止有其他的动作，将等待状态也要set 到 ots
  await otsApp.update(appId, { latest_task: { ...appTaskConfig, completed: engine.context.completed, status: engine.context.status } })

  console.log('engine run start');
  await engine.start();
}

exports.handler = handler;
