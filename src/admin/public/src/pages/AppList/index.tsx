import React, { useEffect, useState } from 'react';
import { useRequest, history, Link } from 'ice';
import { listApp, deleteApp } from '@/services/applist';
import { Button, Search, Loading, Table, Dialog, Icon } from '@alicloud/console-components';
import { filter, includes, debounce, isEmpty, get, isBoolean, isUndefined } from 'lodash';
import PageLayout from '@/layouts/PageLayout';
import NotAppliaction from './components/NotAppliaction';
import { CreateAppLication } from '../Create';
import { formatTime } from '@/utils';
import EnvList from '@/pages/AppDetail/components/EnvList';
import { C_REPOSITORY } from '@/constants/repository';
import ExternalLink from '@/components/ExternalLink';
import { Toast } from '@/components/ToastContainer';
import { sleep } from '@/utils';
import store from '@/store';

interface IItem {
  providerUid: number;
  userId: string;
  repo: string;
  provider: string;
  repo_name: string;
  createdTime: number;
}

const AppList = ({
  match: {
    params: { orgName },
  },
}) => {
  const [userState] = store.useModel('user');

  if (isEmpty(orgName)) {
    const username = get(userState, 'userInfo.username');
    return history?.push(`/${username}/application`);
  }

  const { data, request, refresh, cancel } = useRequest(listApp, {
    pollingInterval: 5000,
  });
  const [applist, setApplist] = useState<Array<IItem>>([]);
  const [queryKey, setQueryKey] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    await request();
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isEmpty(data)) {
      return cancel();
    }
    setApplist(data);
    const completedList: boolean[] = [];
    for (const item of data) {
      const environment = get(item, 'environment', {});
      for (const key in environment) {
        const ele = environment[key];
        const completed = get(ele, 'latest_task.completed');
        if (isBoolean(completed) && !completed) {
          completedList.push(completed);
        }
      }
    }
    if (completedList.length === 0) {
      cancel();
    }
  }, [JSON.stringify(data)]);

  const handleRefresh = async () => {
    setLoading(true);
    await refresh();
    setLoading(false);
  };

  const onSearch = (value: any) => {
    setQueryKey(value);
    if (data.length > 0) {
      setApplist(filter(data, (item) => includes(item.repo_name, value)));
    }
  };
  const debounceSearch = debounce(onSearch, 250, { maxWait: 1000 });

  const onCreateApp = () => {
    history?.push(`/${orgName}/create`);
  };

  if (loading) {
    return <Loading visible={loading} inline={false} style={{ minHeight: 500 }} />;
  }

  const deleteApplication = (record) => {
    const dialog = Dialog.alert({
      title: `删除应用：${record.repo_name}`,
      content: '您确定删除当前应用吗?',
      onOk: async () => {
        const { success } = await deleteApp({ appId: record.id });
        if (success) {
          Toast.success('应用删除成功');
          await sleep(800);
          history?.push(`/${orgName}`);
        }
        dialog.hide();
      },
    });
  };

  const columns = [
    {
      title: '应用名称',
      dataIndex: 'repo_name',
      cell: (value, index, record) => {
        return <Link to={`/${orgName}/application/${record.id}`}>{value}</Link>;
      },
    },
    {
      key: 'created_time',
      title: '创建时间',
      dataIndex: 'created_time',
      cell: (value, _index, record) => formatTime(value),
    },
    {
      key: 'description',
      title: '代码源',
      dataIndex: 'description',
      cell: (value, _index, record) => (
        <div className="align-center">
          {C_REPOSITORY[record.provider as any]?.svg(16)}
          <ExternalLink
            className="color-link cursor-pointer ml-4"
            url={record.repo_url}
            label={record.repo_name}
          />
        </div>
      ),
    },
    {
      key: 'description',
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      cell: (value, _index, record) => (
        <Button type="primary" text onClick={() => deleteApplication(record)} loading={loading}>
          删除
        </Button>
      ),
    },
  ];

  if (isUndefined(data)) return null;
  return (
    <PageLayout
      breadcrumbs={[
        {
          name: '应用列表',
        },
      ]}
      hideBackground
    >
      {data.length === 0 ? (
        <CreateAppLication orgName={orgName} />
      ) : (
        <>
          <div className="flex-r mb-16">
            <div>
              <Button type="primary" onClick={onCreateApp}>
                创建应用
              </Button>
              <Search
                className="ml-8"
                shape="simple"
                placeholder="Search"
                onChange={debounceSearch}
              />
            </div>
            <Button onClick={handleRefresh}>
              <Icon type="refresh" />
            </Button>
          </div>
          {applist.length > 0 ? (
            <Table
              hasBorder={false}
              dataSource={applist}
              columns={columns}
              expandedRowRender={(record) => {
                return (
                  <div className="pt-8 pb-8">
                    <EnvList appId={record.id} orgName={orgName} data={record} refresh={refresh} />
                  </div>
                );
              }}
            />
          ) : (
            <NotAppliaction orgName={orgName} queryKey={queryKey} />
          )}
        </>
      )}
    </PageLayout>
  );
};

export default AppList;
