const path = require('path');
const core = require('@serverless-cd/core');
const {
  DOMAIN,
  REGION,
  DOWNLOAD_CODE_DIR: execDir,
  CD_PIPELINE_YAML,
  CREDENTIALS,
  DEFAULT_UNSET_ENVS,
  LOG_LOCAL_PATH_PREFIX,
} = require('@serverless-cd/config');

const checkout = require('@serverless-cd/git').default;
const Setup = require('@serverless-cd/setup-runtime').default;
const Engine = require('@serverless-cd/engine').default;

const _ = core.lodash;
const { getPayload, getTaskPayload, getOssConfig } = require('./utils');
const { updateAppEnvById, makeTask } = require('./model');

async function handler(event, _context, callback) {
  // 解析入参
  const inputs = getPayload(event);
  console.log(JSON.stringify(inputs, null, 2));
  const {
    taskId,
    provider,
    cloneUrl,
    pusher,
    authorization: { dispatchOrgId, repo_owner, appId, accessToken: token, secrets } = {},
    ref,
    commit,
    message,
    branch,
    tag,
    event_name,
    customInputs = {},
    environment = {},
    envName,
    trigger_type = provider,
  } = inputs;
  const envSecrets = _.get(environment, `${envName}.secrets`) || {};

  const cwdPath = path.join(execDir, taskId);
  const logPrefix = `${LOG_LOCAL_PATH_PREFIX}/${taskId}`;
  core.fs.emptyDirSync(logPrefix);
  console.log('start task, uuid: ', taskId);

  let url = '';
  if (DOMAIN && dispatchOrgId) {
    const [, orgName] = _.split(dispatchOrgId, ':');
    if (orgName) {
      url = `${DOMAIN}/${orgName}/application/${appId}/detail/${envName}/${taskId}`;
    }
    console.log(`get task url: ${url}, target org name: ${orgName}`);
  }

  const appTaskConfig = { taskId, commit, message, ref, trigger_type };

  const getEnvData = (context) => ({
    ...appTaskConfig,
    completed: context.completed,
    status: context.status,
  });

  // 拉取代码
  const onInit = async (context, logger) => {
    logger.info('onInit: checkout start');
    logger.debug(`start checkout code, taskId: ${taskId}`);
    await checkout({
      token,
      provider,
      logger,
      owner: repo_owner,
      clone_url: cloneUrl,
      execDir: cwdPath,
      ref,
      commit,
    });
    logger.info('checkout success');

    // 解析 pipeline
    const pipLineYaml = path.join(
      cwdPath,
      _.get(environment, `${envName}.cd_pipeline_yaml`) || CD_PIPELINE_YAML,
    );
    logger.info(`parse spec: ${pipLineYaml}`);
    const pipelineContext = core.parseSpec(pipLineYaml);
    logger.debug(`pipelineContext:: ${JSON.stringify(pipelineContext)}`);
    const steps = _.get(pipelineContext, 'steps');
    logger.debug(`parse spec success, steps: ${JSON.stringify(steps)}`);
    logger.debug(`start update app`);
    logger.info(`update app in engine onInit: ${JSON.stringify(environment)}`);
    await updateAppEnvById(appId, envName, getEnvData(context));
    logger.debug(`start update app success`);

    const runtimes = _.get(pipelineContext, 'runtimes', []);
    logger.info(`start init runtime: ${runtimes}`);
    const setup = new Setup({
      runtimes,
      credentials: CREDENTIALS,
      region: REGION,
    });
    await setup.run();
    logger.info(`init runtime success`);

    return { steps };
  };

  // 启动 engine
  const engine = new Engine({
    cwd: cwdPath,
    logConfig: {
      logPrefix,
      ossConfig: getOssConfig(),
      // logLevel: 'debug',
    },
    inputs: {
      ...customInputs,
      task: {
        id: taskId,
        url,
      },
      app: {
        // 应用的关联配置
        dispatch_org_id: dispatchOrgId,
        id: appId,
      },
      secrets: _.merge(secrets, envSecrets),
      git: {
        // git 相关的内容
        repo_owner,
        provider, // 托管仓库
        clone_url: cloneUrl, // git 的 url 地址
        ref,
        commit,
        branch,
        message,
        tag,
        event_name, // 触发的事件名称
        pusher,
      },
    },
    events: {
      onInit,
      onPreRun: async function (_data, context) {
        await makeTask(taskId, {
          status: context.status,
          steps: getTaskPayload(context.steps),
        });
      },
      onPostRun: async function (_data, context) {
        await makeTask(taskId, {
          status: context.status,
          steps: getTaskPayload(context.steps),
        });
      },
      onCompleted: async function (context, logger) {
        await makeTask(taskId, {
          status: context.status,
          steps: getTaskPayload(context.steps),
        });
        logger.info(`onCompleted environment: ${JSON.stringify(environment)}`);
        await updateAppEnvById(appId, envName, getEnvData(context));
        logger.info('completed end.');
        callback(null, '');
      },
    },
    unsetEnvs: DEFAULT_UNSET_ENVS,
  });

  console.log('init task');
  await makeTask(taskId, {
    trigger_type,
    env_name: envName,
    dispatch_org_id: dispatchOrgId,
    app_id: appId,
    status: engine.context.status,
    trigger_payload: inputs,
  });
  console.log('App update environment', JSON.stringify(environment));
  // 防止有其他的动作，将等待状态也要set 到表中
  await updateAppEnvById(appId, envName, getEnvData(engine.context));
  console.log('engine run start');
  await engine.start();
}

exports.handler = handler;
