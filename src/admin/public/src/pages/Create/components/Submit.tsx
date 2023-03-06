import React, { useState } from 'react';
import { Field, Button } from '@alicloud/console-components';
import { createApp } from '@/services/applist';
import { manualDeployApp } from '@/services/task';
import { checkFile, githubPutFile } from '@/services/git';
import { history } from 'ice';
import { CREATE_TYPE, SERVERLESS_PIPELINE_CONTENT, PUSH } from './constant';
import { get } from 'lodash';
import { getConsoleConfig, sleep } from '@/utils';
import { Toast } from '@/components/ToastContainer';
import yaml from 'js-yaml';
import { TYPE as ENV_TYPE } from '@/components/EnvType';

interface IProps {
  field: Field;
  orgName: string;
  disabled?: boolean;
}

const Submit = (props: IProps) => {
  const { orgName, field, disabled = false } = props;
  const CD_PIPELINE_YAML = getConsoleConfig('CD_PIPELINE_YAML', 'serverless-pipeline.yaml');
  const [loading, setLoading] = useState(false);
  const { validate } = field;

  const submit = async () => {
    validate(async (errors, values) => {
      console.log(errors, values);
      if (errors) return;
      const push = get(values, 'trigger.push');
      setLoading(true);
      const res =
        push === PUSH.NEW
          ? await createWithNewBranch(values)
          : await createWithSpecifyBranch(values);
      // 创建应用失败
      if (res?.success !== true) {
        return setLoading(false);
      }
      await sleep(1500);
      setLoading(false);
      Toast.success('应用创建成功');
      // /${orgName} = > /${orgName}/application 重新加载应用列表
      history?.push(`/${orgName}`);
    });
  };

  const createWithNewBranch = async (values) => {
    // push 代码到新分支
    const branch = get(values, 'trigger.branch');
    const { success: putFileSuccess } = await githubPutFile({
      owner: get(values, 'repo.owner'),
      repo: get(values, 'repo.value'),
      ref: `refs/heads/${branch}`,
      sha: get(values, 'trigger.commit_sha'),
      path: CD_PIPELINE_YAML,
      message: `Add ${CD_PIPELINE_YAML} by Serverless CD`,
      content: yaml.dump(SERVERLESS_PIPELINE_CONTENT),
      branch,
    });

    if (!putFileSuccess) return;
    // 创建应用
    const { success: createAppSuccess, data } = await doCreateApp(values);
    if (!createAppSuccess) return;
    // 部署应用
    await doManualDeployApp(data.id, branch);
    return { success: true };
  };
  const createWithSpecifyBranch = async (values) => {
    const branch = get(values, 'trigger.branch');
    // 检查分支是否存在pipeline文件
    const { success: checkFileSuccess } = await checkFile({
      clone_url: get(values, 'repo.url'),
      ref: `refs/heads/${branch}`,
      provider: get(values, 'gitType'),
      owner: get(values, 'repo.owner'),
      file: CD_PIPELINE_YAML,
    });
    if (!checkFileSuccess) return;
    // 创建应用
    const { success: createAppSuccess, data } = await doCreateApp(values);
    if (!createAppSuccess) return;
    // 部署应用
    const deployEnable = get(values, 'deployEnable', false);
    deployEnable && (await doManualDeployApp(data.id, branch));
    return { success: true };
  };

  const doCreateApp = async (values) => {
    const trigger_spec: any = {
      [values['gitType']]: { push: { branches: { precise: [get(values, 'trigger.branch')] } } },
    };
    const dataMap = {
      [CREATE_TYPE.Repository]: {
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
    return await createApp(dataMap[get(values, 'createType')]);
  };
  const doManualDeployApp = async (appId: string, branch: string) => {
    await manualDeployApp({
      appId,
      ref: `refs/heads/${branch}`,
    });
  };

  return (
    <Button className="mt-32 mr-8" type="primary" onClick={submit} disabled={disabled} loading={loading}>
      创建
    </Button>
  );
};

export default Submit;
