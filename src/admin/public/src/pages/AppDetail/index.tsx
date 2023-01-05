import React, { useEffect } from 'react';
import { useRequest, history, Link } from 'ice';
import { Button, Dialog, Loading, Table } from '@alicloud/console-components';
import PageLayout from '@/layouts/PageLayout';
import EnvType from '@/components/EnvType';
import CreateEnv from '@/pages/EnvDetail/components/CreateEnv';
import BasicInfoDetail from '@/components/BasicInfoDetail';
import { applicationDetail, deleteApp } from '@/services/applist';
import { Toast } from '@/components/ToastContainer';
import { sleep, formatTime } from '@/utils';
import { get } from 'lodash';

const Details = ({
  match: {
    params: { appId },
  },
}) => {
  const { loading, data: detailInfo, request, refresh } = useRequest(applicationDetail);
  const repo_name = get(detailInfo, 'data.repo_name', '');

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

  const getEnvData = () => {
    const data: any = [];
    const environment = get(detailInfo, 'data.environment', {});
    for (const key in environment) {
      const element = environment[key];
      data.push({
        name: key,
        type: get(element, 'type'),
        created_time: get(element, 'created_time') || get(detailInfo, 'data.created_time'),
      });
    }
    return data;
  };

  const columns = [
    {
      key: 'name',
      title: '环境名称',
      dataIndex: 'name',
      cell: (value, _index, record) => (
        <>
          <Link to={`/application/${appId}/detail/${value}`}>{value}</Link>
        </>
      ),
    },
    {
      key: 'type',
      title: '环境类型',
      dataIndex: 'type',
      cell: (value, _index, record) => <EnvType type={value} />,
    },
    {
      key: 'created_time',
      title: '创建时间',
      dataIndex: 'created_time',
      cell: (value, _index, record) => formatTime(value),
    },
  ];

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
          <CreateEnv data={get(detailInfo, 'data', {})} appId={appId} refresh={refresh}>
            <Button type="primary">创建环境</Button>
          </CreateEnv>
          <Button className="ml-8" type="primary" warning onClick={deleteApplication}>
            删除应用
          </Button>
        </>
      }
    >
      <Loading visible={loading} inline={false}>
        <BasicInfoDetail data={get(detailInfo, 'data', {})} refreshCallback={refresh} />
        <hr className="mb-20 mt-20" />
        <Table dataSource={getEnvData()} columns={columns} />
      </Loading>
    </PageLayout>
  );
};

export default Details;
