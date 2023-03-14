import React from 'react';
import CreateTemplateDialog from '@serverless-cd/creating-ui';
import { createByTemplate } from '@/services/applist';
import { doManualDeployApp, doCreateApp } from '@/services/common';
import { getParams, getConsoleConfig } from '@/utils';
import { get } from 'lodash';
import { CREATE_TYPE, SERVERLESS_PIPELINE_CONTENT_TEMPLATE } from './constant';
import { history } from 'ice';
import yaml from 'js-yaml';

interface IProps {
  value: any;
  createType?: `${CREATE_TYPE}`;
  orgName: string;
}
declare type status = 'wait' | 'finish';
declare type Request = {
  title: string;
  key: string;
  runStatus?: status;
  errorMsg?: string;
  successMsg?: string;
  runningMsg?: string;
  tasks?: Request[];
  run?: (content: any) => void;
};
declare type Repo = {
  url?: string;
  id?: number;
  name?: string;
  owner?: string;
};

const TemplateDialog = (props: IProps) => {
  const { value, createType, orgName } = props;
  const repoName = get(value, 'repoName');
  const provider = 'github';
  const branch = get(value, 'trigger.branch') || 'master';
  const appId = get(getParams(location?.search), 'template');
  const owner = get(value, 'gitUser.value');
  const body = {
    provider: provider,
    appId: appId,
    owner: owner,
    repo: repoName,
    template: `devsapp/${appId}`,
  };
  let repo: Repo = {
    name: repoName,
    owner: owner,
    url: `https://${provider}.com/${owner}/${repoName}`,
  };

  const setRepo = (data) => {
    const { id, url } = data;
    repo = { ...repo, id, url };
  };

  const dataSource: Request[] = [
    {
      title: '同步仓库',
      runStatus: 'wait',
      key: 'synchronizeRepo',
      runningMsg: '同步仓库中...',
      successMsg: '同步仓库成功',
      errorMsg: '同步仓库失败',
      tasks: [
        {
          key: 'initTemplate',
          title: '初始化模版',
          runningMsg: '初始化模版中',
          successMsg: '初始化模版成功',
          errorMsg: '初始化模版失败',
          run: async () => {
            console.log('999');
            const pathName = getConsoleConfig('CD_PIPELINE_YAML', 'serverless-pipeline.yaml');
            const content = yaml.dump(SERVERLESS_PIPELINE_CONTENT_TEMPLATE);
            const res = await createByTemplate({
              ...body,
              type: 'initTemplate',
              content,
              pathName,
            });
            if (!res.success) {
              throw new Error(res.message);
            } else {
              return res.data;
            }
          },
        },
        {
          key: 'createRepo',
          title: '创建远程仓库',
          runningMsg: '远程仓库创建中',
          successMsg: '远程仓库创建成功',
          errorMsg: '远程仓库创建失败',
          run: async () => {
            const res = await createByTemplate({ ...body, type: 'initRepo' });
            if (!res.success) {
              throw new Error(res.message);
            } else {
              const { data } = res;
              setRepo(data);
              return data;
            }
          },
        },
        {
          key: 'initCommit',
          title: '初始化commit信息',
          runningMsg: '初始化commit信息中',
          successMsg: '初始化commit信息成功',
          errorMsg: '初始化commit信息失败',
          run: async () => {
            const res = await createByTemplate({ ...body, type: 'initCommit' });
            if (!res.success) {
              throw new Error(res.message);
            } else {
              return res.data;
            }
          },
        },
        {
          key: 'pushFile',
          title: '同步远程代码到仓库',
          runningMsg: '同步远程代码到仓库中',
          successMsg: '同步远程代码到仓库成功',
          errorMsg: '同步远程代码到仓库失败',
          run: async () => {
            const res = await createByTemplate({ ...body, type: 'push' });
            if (!res.success) {
              throw new Error(res.message);
            } else {
              return res.data;
            }
          },
        },
      ],
    },
    {
      key: 'createApp',
      title: '创建应用',
      runStatus: 'wait',
      runningMsg: '创建应用中',
      successMsg: '创建应用成功',
      errorMsg: '创建应用失败',
      run: async () => {
        // 创建应用
        const res = await doCreateApp({ ...value, repo }, createType);
        if (!res.success) {
          throw new Error(res.message);
        } else {
          return res.data;
        }
      },
    },
    {
      title: '部署',
      runStatus: 'wait',
      key: 'deploy',
      runningMsg: '部署中...',
      successMsg: '部署成功',
      errorMsg: '部署失败',
      run: async (params) => {
        const { id } = params.content.createApp.result;
        const res = await doManualDeployApp(id, branch);
        if (!res.success) {
          throw new Error(res.message);
        } else {
          return res.data;
        }
      },
    },
    {
      key: 'success',
      title: '完成创建，即将跳去应用列表页面',
      runStatus: 'wait',
      runningMsg: '完成创建，即将跳去应用列表页面',
      successMsg: '即将跳转',
      errorMsg: '跳转失败',
      run: async () => {
        return await new Promise((resolve, reject) => {
          setTimeout(() => {
            history?.push(`/${orgName}`);
            resolve();
          }, 3000);
        });
      },
    },
  ];

  return <CreateTemplateDialog dataSource={dataSource}></CreateTemplateDialog>;
};

export default TemplateDialog;
