import React, { useEffect } from 'react';
import { useRequest, history } from 'ice';
import { Button, Dialog, Loading } from '@alicloud/console-components';
import PageLayout from '@/layouts/PageLayout';
import CommitList from './components/CommitList';
import BasicInfoDetail from '@/components/BasicInfoDetail';
import { applicationDetail, deleteApp } from '@/services/applist';
import { Toast } from '@/components/ToastContainer';
import PageInfo from '@/components/PageInfo';
import { sleep } from '@/utils';
import { get } from 'lodash';
import SecretConfig from './components/SecretCofing';
import TriggerConfig from './components/TriggerConfig';

const Details = ({
  match: {
    params: { appId },
  },
}) => {
  const { loading, data: detailInfo, request, refresh } = useRequest(applicationDetail);
  const provider = get(detailInfo, 'data.provider');
  const trigger_spec = get(detailInfo, `data.trigger_spec`, {});
  const taskId = get(detailInfo, 'data.latest_task.taskId', '');
  const repo_name = get(detailInfo, 'data.repo_name', '');
  const secrets = get(detailInfo, 'data.secrets', {});

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

  const deleteApplication = () => {
    const dialog = Dialog.alert({
      title: `删除应用：${repo_name}`,
      content: '您确定删除当前应用吗?',
      onOk: async () => {
        const { success } = await deleteApp({ appId });
        if (success) {
          Toast.success('应用删除成功');
          await sleep(800);
          history?.push('/');
        }
        dialog.hide();
      },
    });
  };

  return (
    <PageLayout
      title="应用详情"
      subhead={repo_name}
      breadcrumbs={[
        {
          name: '应用列表',
          path: '/',
        },
        {
          name: appId,
        },
      ]}
      breadcrumbExtra={
        <Button type="primary" warning onClick={deleteApplication}>
          删除应用
        </Button>
      }
    >
      <Loading visible={loading} style={{ width: '100%' }}>
        <BasicInfoDetail data={get(detailInfo, 'data', {})} refreshCallback={refresh} />
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
