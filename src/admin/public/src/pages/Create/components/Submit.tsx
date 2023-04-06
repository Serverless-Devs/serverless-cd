import React, { useState } from 'react';
import { Field, Button, Dialog } from '@alicloud/console-components';
import { doCreateApp, doManualDeployApp } from '@/services/common';
import { checkFile, githubPutFile } from '@/services/git';
import { history } from 'ice';
import { CREATE_TYPE, SERVERLESS_PIPELINE_CONTENT, PUSH } from './constant';
import { get } from 'lodash';
import { getConsoleConfig, sleep } from '@/utils';
import { Toast } from '@/components/ToastContainer';
import yaml from 'js-yaml';

interface IProps {
  field: Field;
  orgName: string;
  disabled?: boolean;
  createType: `${CREATE_TYPE}`;
  createTemplate?: boolean;
  setVisible?: any;
  createDisabled?: boolean;
}

const Submit = (props: IProps) => {
  const {
    orgName,
    field,
    disabled = false,
    createType,
    createTemplate,
    setVisible,
    createDisabled,
  } = props;
  const CD_PIPELINE_YAML = getConsoleConfig('CD_PIPELINE_YAML', 'serverless-pipeline.yaml');
  const [loading, setLoading] = useState(false);
  const { validate } = field;

  const submitByTemplate = async () => {
    setVisible(true);
  };

  const skipValidate = async () => {
    Dialog.confirm({
      title: '确定跳过校验吗',
      content: '若您跳过校验，将不会检测仓库名称是否合法化',
      onOk: async () => {
        createTemplate ? submitByTemplate() : await submit();
      },
    });
  };

  const submit = async () => {
    validate(async (errors, values) => {
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
    const { success: createAppSuccess, data } = await doCreateApp(values, createType);
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
      repo_owner: get(values, 'repo.owner'),
      file: CD_PIPELINE_YAML,
    });
    if (!checkFileSuccess) return;
    // 创建应用
    const { success: createAppSuccess, data } = await doCreateApp(values, createType);
    if (!createAppSuccess) return;
    // 部署应用
    const deployEnable = get(values, 'deployEnable', false);
    deployEnable && (await doManualDeployApp(data.id, branch));
    return { success: true };
  };

  return (
    <div>
      <Button
        className="mt-32 mr-8"
        type="primary"
        onClick={createTemplate ? submitByTemplate : submit}
        disabled={disabled || (createTemplate && createDisabled)}
        loading={loading}
      >
        创建
      </Button>
      {createTemplate && (
        <Button
          className="mt-32 mr-8"
          type="normal"
          onClick={skipValidate}
          disabled={disabled || !(createTemplate && createDisabled)}
          loading={loading}
        >
          跳过校验直接创建
        </Button>
      )}
    </div>
  );
};

export default Submit;
