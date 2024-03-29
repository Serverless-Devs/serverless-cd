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
      name: get(values, 'name'),
      template: get(values, 'template', undefined),
      repo_owner: get(values, 'repo.repo_owner') || get(values, 'repo.owner'),
      repo_id: String(get(values, 'repo.id')),
      environment: {
        default: {
          type: ENV_TYPE.TESTING,
          cloud_alias: get(values, 'cloud_alias', ''),
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
