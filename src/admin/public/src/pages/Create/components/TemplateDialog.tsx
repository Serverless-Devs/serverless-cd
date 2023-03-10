import React from 'react';
import CreateTemplateDialog from '@serverless-cd/creating-ui';
import { Field } from '@alicloud/console-components';
import { createByTemplate } from '@/services/applist';
import { doManualDeployApp, doCreateApp } from '@/services/common';
import { getParams } from '@/utils';
import { get } from 'lodash';
import { CREATE_TYPE } from './constant';

interface IProps {
  field?: Field;
  value?: any;
  createType?: `${CREATE_TYPE}`;
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
  const { value, createType } = props;
  const repoName = get(value, 'repoName');
  const provider = 'github';
  const appId = get(getParams(location?.search), 'template');
  const owner = get(value, 'gitUser.value');
  const body = {
    provider: provider,
    appId: appId,
    owner: owner,
    repo: repoName,
    template: 'devsapp/start-express',
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
            try {
              return await createByTemplate({ ...body, type: 'initTemplate' });
            } catch (e) {
              return Promise.reject();
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
            try {
              const { data } = await createByTemplate({ ...body, type: 'initRepo' });
              setRepo(data);
            } catch (e) {
              return Promise.reject();
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
            await createByTemplate({ ...body, type: 'initCommit' });
            const res = await createByTemplate({ ...body, type: 'push' });
            if (get(res, 'data.isEmpty')) {
              return Promise.reject();
            }
          },
        },
      ],
    },
    {
      title: '创建',
      runStatus: 'wait',
      key: 'create',
      runningMsg: '创建中...',
      successMsg: '创建成功',
      errorMsg: '创建失败',
      tasks: [
        {
          key: 'createApp',
          title: '创建应用',
          runningMsg: '创建应用中',
          successMsg: '创建应用成功',
          errorMsg: '创建应用失败',
          run: async () => {
            try {
              // 创建应用
              const { success: createAppSuccess, data } = await doCreateApp(
                { ...value, repo },
                createType,
              );
              if (!createAppSuccess) return;
              // 部署应用
              await doManualDeployApp(data.id, 'master');
              return { success: true };
            } catch (e) {
              return Promise.reject();
            }
          },
        },
      ],
    },
  ];

  return <CreateTemplateDialog dataSource={dataSource}></CreateTemplateDialog>;
};

export default TemplateDialog;
