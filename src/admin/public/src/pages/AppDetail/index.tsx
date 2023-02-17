import React, { useEffect, useState } from 'react';
import { useRequest, history } from 'ice';
import { Button, Dialog, Loading } from '@alicloud/console-components';
import PageLayout from '@/layouts/PageLayout';
import CreateEnv from '@/pages/EnvDetail/components/CreateEnv';
import BasicInfoDetail from '@/components/BasicInfoDetail';
import { applicationDetail, deleteApp } from '@/services/applist';
import { Toast } from '@/components/ToastContainer';
import EnvList from './components/EnvList';
import { sleep } from '@/utils';
import { get, isEmpty, isBoolean } from 'lodash';

const Details = ({
  match: {
    params: { appId, orgName },
  },
}) => {
  const {
    data: detailInfo,
    request,
    refresh,
    cancel,
  } = useRequest(applicationDetail, { pollingInterval: 5000 });
  const [loading, setLoading] = useState(false);
  const repo_name = get(detailInfo, 'data.repo_name', '');

  const fetchData = async () => {
    setLoading(true);
    await request({ id: appId });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await refresh();
    setLoading(false);
  };

  useEffect(() => {
    if (isEmpty(detailInfo)) return;
    if (detailInfo.success) {
      const data: any = [];
      const environment = get(detailInfo, 'data.environment', {});
      for (const key in environment) {
        const ele = environment[key];
        const completed = get(ele, 'latest_task.completed');
        if (isBoolean(completed) && !completed) {
          data.push(completed);
        }
      }

      if (data.length === 0) {
        cancel();
      }
    } else {
      cancel();
      const dialog = Dialog.alert({
        title: `应用详情信息出错`,
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
  }, [JSON.stringify(detailInfo)]);

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
        <>
          <CreateEnv data={get(detailInfo, 'data', {})} appId={appId} callback={handleRefresh}>
            <Button type="primary">创建环境</Button>
          </CreateEnv>
          <Button className="ml-8" type="primary" warning onClick={deleteApplication}>
            删除应用
          </Button>
        </>
      }
    >
      <Loading visible={loading} inline={false}>
        <BasicInfoDetail data={get(detailInfo, 'data', {})} refreshCallback={handleRefresh} />
        <hr className="mb-20 mt-20" />
        <EnvList
          appId={appId}
          orgName={orgName}
          data={get(detailInfo, 'data', {})}
          refresh={refresh}
        />
      </Loading>
    </PageLayout>
  );
};

export default Details;
