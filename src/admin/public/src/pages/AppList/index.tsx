import React, { useEffect, useState } from 'react';
import { useRequest, history, Link } from 'ice';
import { listApp, deleteApp } from '@/services/applist';
import {
  Button,
  Search,
  Loading,
  Table,
  Dialog,
  Icon,
  Balloon,
} from '@alicloud/console-components';
import { filter, includes, debounce, isEmpty, get, isBoolean, isUndefined, map } from 'lodash';
import PageLayout from '@/layouts/PageLayout';
import NotAppliaction from './components/NotAppliaction';
import { CreateAppLication } from '../Create';
import { formatTime } from '@/utils';
import EnvList from './components/EnvList';
import { Toast } from '@/components/ToastContainer';
import { sleep, getOrgName, localStorageSet } from '@/utils';
import store from '@/store';
import Status from '@/components/DeployStatus';
import Copy from '@/components/CopyIcon';
import CodeSource from '@/components/CodeSource';

const { Tooltip } = Balloon;

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
  const userInfo: any = get(userState, 'userInfo', {});
  /**
   * 未请求到用户信息时，不渲染页面
   */
  if (isEmpty(userInfo)) return null;
  if (isEmpty(orgName)) {
    const newOrgName = getOrgName();
    if (newOrgName) {
      return history?.push(`/${newOrgName}/application`);
    }
    localStorageSet(userInfo.id, userInfo.username);
    return history?.push(`/${userInfo.username}/application`);
  }

  const { data, request, refresh, cancel } = useRequest(listApp, {
    pollingInterval: 5000,
    pollingWhenHidden: false
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
    return () => cancel();
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
      title: `删除应用：${record.name || record.repo_name}`,
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

  const repoNameRender = (value, _index, record) => {
    return (
      <>
        <Tooltip
          trigger={<Link to={`/${orgName}/application/${record.id}/default/overview`}>{value}</Link>}
          align="t"
        >
          <div className="text-bold">环境名称</div>
          {map(record.environment, (ele, envName) => {
            return (
              <div className="align-center mt-8">
                <Link to={`/${orgName}/application/${record.id}/${envName}/overview`}>{envName}</Link>
                <span className="ml-2 mr-8">:</span>
                <Status status={get(ele, 'latest_task.status', 'init')} />
              </div>
            );
          })}
        </Tooltip>
        <div className="cursor-pointer pt-8">
          <Copy content={record.id} >{record.id}</Copy>
        </div>
      </>
    );
  };

  const columns = [
    {
      title: '应用名称',
      dataIndex: 'name',
      cell: repoNameRender,
    },
    {
      key: 'created_time',
      title: ' 最后操作时间',
      dataIndex: 'updated_time',
      cell: (value, _index, record) => formatTime(value || record.created_time),
    },
    {
      key: 'provider',
      title: '代码源',
      dataIndex: 'provider',
      cell: (value, _index, record) => <CodeSource provider={value} repo_url={record.repo_url} repo_name={record.repo_name || record.name} />,
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
