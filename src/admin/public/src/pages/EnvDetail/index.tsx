import React, { useEffect, useState } from 'react';
import { useRequest, history } from 'ice';
import { Button, Dialog, Loading, Select, Tab, Balloon } from '@alicloud/console-components';
import PageLayout from '@/layouts/PageLayout';
import BasicInfoDetail from './components/BasicInfoDetail';
import { applicationDetail, removeEnv } from '@/services/applist';
import TaskList from '@/components/TaskList';
import PageInfo from '@/components/PageInfo';
import { get, isEmpty, isBoolean, keys } from 'lodash';
import SecretConfig from './components/SecretCofing';
import TriggerConfig from './components/TriggerConfig';
import CreateEnv from './components/CreateEnv';
import { Toast } from '@/components/ToastContainer';
import BasicInfo from '@/components/BasicInfo';
import { getParam, setSearchParams } from '@/utils';
import { strictValuesParse } from '@serverless-cd/trigger-ui';


const { Tooltip } = Balloon;

enum TAB {
  OVERVIEW = 'overview',
  CICD = 'cicd',
  RESOURCE = 'resource',
}

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
  const defaultTab = getParam('tab') || TAB.OVERVIEW;
  const [tabKey, setTabKey] = useState(defaultTab);

  const data = get(detailInfo, 'data', {});
  const resource = get(data, `environment.${envName}.resource`, {});
  const provider = get(detailInfo, 'data.provider');
  const trigger_spec = get(detailInfo, `data.environment.${envName}.trigger_spec`, {});
  const taskId = get(detailInfo, `data.environment.${envName}.latest_task.taskId`, '');
  const secrets = get(detailInfo, `data.environment.${envName}.secrets`, {});
  const appName = get(detailInfo, 'data.name') || get(detailInfo, 'data.repo_name', '');
  const triggetInfo = strictValuesParse(get(trigger_spec, provider, {}));
  const triggerType = triggetInfo['triggerType'];

  const fetchData = async () => {
    setLoading(true);
    await request({ id: appId });
    setLoading(false);
  };

  useEffect(() => {
    setSearchParams({
      tab: tabKey,
    });
  }, [tabKey]);

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
    history?.push(`/${orgName}/application/${appId}/${value}?tab=${tabKey}`);
    forceUpdate(Date.now());
  };

  const onTabChange = (value: string) => {
    setTabKey(value);
  }

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
      <Tab shape="pure" activeKey={tabKey} onChange={onTabChange}>
        <Tab.Item key={TAB.OVERVIEW} title="应用概览">
          <Loading visible={loading} inline={false} className="mt-16">
            <BasicInfoDetail
              data={data}
              refreshCallback={handleRefresh}
              envName={envName}
              orgName={orgName}
            />
          </Loading>
        </Tab.Item>
        <Tab.Item key={TAB.CICD} title="CI/CD">
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
                  value: triggerType
                },
                {
                  text: '触发分支',
                  value: triggerType === 'pull_request' ? get(triggetInfo, `${triggerType}Target`) : get(triggetInfo, `${triggerType}Value`),
                },
                {
                  text: '目标分支',
                  value: get(triggetInfo, `pull_requestSource`, '-'),
                  hidden: triggerType !== 'pull_request'
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
                repoOwner={get(data, 'repo_owner')}
                repoName={get(data, 'repo_name')}
                triggerTypes={['console', 'webhook']}
              />
            </PageInfo>
          </Loading>
        </Tab.Item>
        <Tab.Item key={TAB.RESOURCE} title="运维管理">
          <Loading visible={loading} inline={false} className="mt-16">
            TODO:
            {get(resource, 'fc', []).map((item) => <div>{`${item.uid}/${item.region}/${item.service}/${item.function}`}</div>)}
          </Loading>
        </Tab.Item>
      </Tab>
    </PageLayout>
  );
};

export default Details;
