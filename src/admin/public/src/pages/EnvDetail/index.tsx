import React, { useEffect } from 'react';
import { useRequest, history } from 'ice';
import { Button, Dialog, Loading } from '@alicloud/console-components';
import PageLayout from '@/layouts/PageLayout';
import CommitList from './components/CommitList';
import BasicInfoDetail from './components/BasicInfoDetail';
import { applicationDetail } from '@/services/applist';
import PageInfo from '@/components/PageInfo';
import { get } from 'lodash';
import SecretConfig from './components/SecretCofing';
import TriggerConfig from './components/TriggerConfig';

const Details = ({
  match: {
    params: { appId, envName },
  },
}) => {
  const { loading, data: detailInfo, request, refresh } = useRequest(applicationDetail);
  const provider = get(detailInfo, 'data.provider');
  const trigger_spec = get(detailInfo, `data.environment.${envName}.trigger_spec`, {});
  const taskId = get(detailInfo, 'data.latest_task.taskId', '');
  const secrets = get(detailInfo, `data.environment.${envName}.secrets`, {});

  useEffect(() => {
    request({ id: appId });
  }, []);

  useEffect(() => {
    if (detailInfo && !detailInfo.success) {
      const dialog = Dialog.alert({
        title: `详情信息出错`,
        content: '当前应用详情出错/删除',
        footer: [
          <Button
            type="primary"
            onClick={() => {
              history?.push('/');
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

  return (
    <PageLayout
      title="环境详情"
      subhead={envName}
      breadcrumbs={[
        {
          name: '应用列表',
          path: '/',
        },
        {
          name: appId,
        },
      ]}
    >
      <Loading visible={loading} style={{ width: '100%' }}>
        <BasicInfoDetail
          data={get(detailInfo, 'data', {})}
          refreshCallback={refresh}
          envName={envName}
        />
        <hr className="mb-20" />
        <TriggerConfig
          triggerSpec={trigger_spec}
          provider={provider}
          appId={appId}
          refreshCallback={refresh}
        />
        <hr className="mb-20" />
        <SecretConfig
          secrets={secrets}
          provider={provider}
          appId={appId}
          refreshCallback={refresh}
        />
        <hr className="mb-20 mt-20" />
      </Loading>
      <PageInfo title="部署历史">
        <CommitList
          appId={appId}
          application={get(detailInfo, 'data', {})}
          latestTaskId={taskId}
          refreshCallback={refresh}
        />
      </PageInfo>
    </PageLayout>
  );
};

export default Details;
