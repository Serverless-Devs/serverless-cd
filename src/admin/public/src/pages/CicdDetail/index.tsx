import React, { useEffect, useState } from 'react';
import { useRequest, history } from 'ice';
import { Button, Dialog, Loading, Select, Balloon } from '@alicloud/console-components';
import PageLayout from '@/layouts/PageLayout';
import { applicationDetail, removeEnv } from '@/services/applist';
import TaskList from '@/components/TaskList';
import ShowBranch from '@/components/ShowBranch';
import PageInfo from '@/components/PageInfo';
import { get, isEmpty, isBoolean, keys } from 'lodash';
import SecretConfig from '../EnvDetail/components/SecretCofing';
import TriggerConfig from '../EnvDetail/components/TriggerConfig';
import CreateEnv from '../EnvDetail/components/CreateEnv';
import { Toast } from '@/components/ToastContainer';
import BasicInfo from '@/components/BasicInfo';
import { strictValuesParse } from '@serverless-cd/trigger-ui';
import { filterTriggerInfo } from '@/utils/trigger';

const { Tooltip } = Balloon;

const Details = ({
  match: {
    params: { appId, envName, orgName },
  },
}) => {
  const {
    data: detailInfo,
    request,
    refresh,
    cancel,
  } = useRequest(applicationDetail, { pollingInterval: 5000 });
  const [loading, setLoading] = useState(false);
  const [pageKey, forceUpdate] = useState(0);

  const data = get(detailInfo, 'data', {});
  const provider = get(detailInfo, 'data.provider');
  const trigger_spec = get(detailInfo, `data.environment.${envName}.trigger_spec`, {});
  const taskId = get(detailInfo, `data.environment.${envName}.latest_task.taskId`, '');
  const secrets = get(detailInfo, `data.environment.${envName}.secrets`, {});
  const appName = get(detailInfo, 'data.name') || get(detailInfo, 'data.repo_name', '');
  const triggerInfo = strictValuesParse(filterTriggerInfo(get(trigger_spec, provider, {})));
  const triggerType = triggerInfo['triggerType'];
  const triggerRef =
    triggerType === 'pull_request'
      ? get(triggerInfo, `${triggerType}Target`)
      : get(triggerInfo, `${triggerType}Value`);
  const repoOwner = get(data, 'repo_owner', '');
  const repoName = get(data, 'repo_name', '');

  const fetchData = async () => {
    setLoading(true);
    await request({ id: appId });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [envName]);

  const handleRefresh = async () => {
    setLoading(true);
    await refresh();
    setLoading(false);
  };

  useEffect(() => {
    if (isEmpty(detailInfo)) return;
    if (detailInfo.success) {
      const completed = get(detailInfo, `data.environment.${envName}.latest_task.completed`);
      if (!isBoolean(completed) || (isBoolean(completed) && completed)) {
        cancel();
      }
    } else {
      cancel();
      const dialog = Dialog.alert({
        title: `环境详情信息出错`,
        content: '当前环境详情出错/删除',
        footer: [
          <Button
            type="primary"
            onClick={() => {
              history?.push(`/${orgName}/application`);
              dialog.hide();
            }}
          >
            返回应用列表
          </Button>,
          <Button onClick={() => dialog.hide()}>取消</Button>,
        ],
      });
    }
  }, [detailInfo]);

  const handleDelete = async () => {
    const dialog = Dialog.alert({
      title: `删除环境：${envName}`,
      content: '您确定删除当前环境吗?',
      onOk: async () => {
        const { success } = await removeEnv({ envName, appId });
        if (success) {
          Toast.success('环境删除成功');
          history?.push(`/${orgName}/application/${appId}/default`);
          forceUpdate(Date.now());
        }
        dialog.hide();
      },
    });
  };

  const handleChangeEnv = async (value: string) => {
    history?.push(`/${orgName}/application/${appId}/${value}/cicd`);
    forceUpdate(Date.now());
  };

  return (
    <PageLayout
      title="环境切换"
      key={pageKey}
      subhead={
        <Select
          value={envName}
          dataSource={keys(get(detailInfo, 'data.environment'))}
          onChange={handleChangeEnv}
        />
      }
      breadcrumbs={[
        {
          name: '应用列表',
          path: `/${orgName}/application`,
        },
        {
          name: appName,
        },
      ]}
      breadcrumbExtra={
        <>
          <CreateEnv
            data={get(detailInfo, 'data', {})}
            appId={appId}
            callback={async (value) => {
              history?.push(`/${orgName}/application/${appId}/${value}`);
              forceUpdate(Date.now());
            }}
          >
            <Button type="primary">创建环境</Button>
          </CreateEnv>

          {envName === 'default' ? (
            <Tooltip
              align="t"
              trigger={
                <Button disabled className="ml-8" type="primary" warning onClick={handleDelete}>
                  删除环境
                </Button>
              }
            >
              默认环境不允许删除
            </Tooltip>
          ) : (
            <Button className="ml-8" type="primary" warning onClick={handleDelete}>
              删除环境
            </Button>
          )}
        </>
      }
    >
      <Loading visible={loading} inline={false} className="mt-16">
        <TriggerConfig
          data={get(detailInfo, 'data', {})}
          triggerSpec={trigger_spec}
          provider={provider}
          appId={appId}
          refreshCallback={handleRefresh}
          envName={envName}
        />
        <BasicInfo
          items={[
            {
              text: '触发类型',
              value: triggerType,
            },
            {
              text: '触发分支',
              value: (
                <>
                  {triggerRef ? (
                    <ShowBranch
                      threshold={50}
                      url={`https://${provider}.com/${repoOwner}/${repoName}/tree/${triggerRef}`}
                      label={triggerRef}
                    />
                  ) : (
                    '-'
                  )}
                </>
              ),
            },
            {
              text: '目标分支',
              value: get(triggerInfo, `pull_requestSource`, '-'),
              hidden: triggerType !== 'pull_request',
            },
            {
              text: '指定yaml',
              value: get(detailInfo, `data.environment.${envName}.cd_pipeline_yaml`),
            },
          ]}
          sizePerRow={2}
        />
        <hr className="mb-20" />
        <SecretConfig
          data={get(detailInfo, 'data', {})}
          secrets={secrets}
          provider={provider}
          appId={appId}
          refreshCallback={handleRefresh}
          envName={envName}
        />
        <hr className="mb-20 mt-20" />
        <PageInfo title="部署历史">
          <TaskList
            appId={appId}
            latestTaskId={taskId}
            envName={envName}
            orgName={orgName}
            repoOwner={repoOwner}
            repoName={repoName}
            triggerTypes={['console', 'webhook']}
          />
        </PageInfo>
      </Loading>
    </PageLayout>
  );
};

export default Details;
