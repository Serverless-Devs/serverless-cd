import { createApp } from '@/services/applist';
import { get } from 'lodash';
import { getConsoleConfig } from '@/utils';
import { TYPE as ENV_TYPE } from '@/components/EnvType';
import { manualDeployApp } from '@/services/task';

const CD_PIPELINE_YAML = getConsoleConfig('CD_PIPELINE_YAML', 'serverless-pipeline.yaml');

const doCreateApp = async (values, createType) => {
  const trigger_spec: any = {
    [values['gitType']]: { push: { branches: { precise: [get(values, 'trigger.branch')] } } },
  };
  const dataMap = {
    [createType]: {
      provider: get(values, 'gitType'),
      description: get(values, 'description'),
      repo_url: get(values, 'repo.url'),
      repo: get(values, 'repo.name'),
      owner: get(values, 'repo.owner'),
      provider_repo_id: String(get(values, 'repo.id')),
      environment: {
        default: {
          type: ENV_TYPE.TESTING,
          trigger_spec,
          secrets: get(values, 'secrets', {}),
          cd_pipeline_yaml: CD_PIPELINE_YAML,
        },
      },
    },
  };
  return await createApp(dataMap[createType]);
};
const doManualDeployApp = async (appId: string, branch: string) => {
  await manualDeployApp({
    appId,
    ref: `refs/heads/${branch}`,
  });
};

export { doCreateApp, doManualDeployApp };
