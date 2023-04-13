import React, { memo, useEffect, FC, useState } from 'react';
import { Search, Tag, Table, Pagination, Select } from '@alicloud/console-components';
import Truncate from '@alicloud/console-components-truncate';
import Actions from '@alicloud/console-components-actions';
import { Link, useRequest } from 'ice';
import { getTaskList } from '@/services/task';
import { get, isEmpty, merge, startsWith } from 'lodash';
import moment from 'moment';

import Status from '@/components/DeployStatus';
// import Copy from '@/components/CopyIcon';
import RefreshButton from '@/components/RefreshButton';
import { pollingStatus } from '@/constants';
import CommitId from '@/components/CommitId';
import ShowBranch from '@/components/ShowBranch';
import DeleteCommit from '@/pages/EnvDetail/components/DeleteCommit';
import TriggerType, { ITriggerType, TriggerTypeLable } from './TriggerType';
import Rollback from './Rollback';
import CancelDeploy from './CancelDeploy';


const DEFAULT_TYPES = ['console', 'local', 'webhook'];

interface IProps {
  appId: string;
  envName: string;
  orgName: string;
  latestTaskId?: string;
  triggerTypes?: ITriggerType[];
  repoName?: string;
  repoOwner?: string;
}

const TaskList: FC<IProps> = ({
  appId,
  latestTaskId,
  envName,
  orgName,
  repoName,
  repoOwner,
  triggerTypes = DEFAULT_TYPES,
}) => {
  const [types, setTypes] = useState(triggerTypes);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const initFetchRequest = {
    appId, envName, pageSize, currentPage, triggerTypes: types,
  }
  const { loading, data, request } = useRequest(getTaskList, {
    initialData: { totalCount: 0, result: [] }
  });

  useEffect(() => {
    if (appId) {
      request(initFetchRequest);
    }
  }, [appId]);

  const onSearch = (taskId: string) => {
    request(merge(initFetchRequest, { currentPage: 1, taskId }));
  };

  const onChangePage = (current: number) => {
    setCurrentPage(current);
    request(merge(initFetchRequest, { currentPage: current }));
  };

  const onPageSizeChange = (currentPageSize: number) => {
    setPageSize(currentPageSize);
    setCurrentPage(1);
    request(merge(initFetchRequest, { currentPage: 1, pageSize: currentPageSize }));
  }

  const onTriggerChange = (currentTypes: ITriggerType[]) => {
    const t = isEmpty(currentTypes) ? triggerTypes : currentTypes;
    setTypes(t);
    setCurrentPage(1);
    request(merge(initFetchRequest, { currentPage: 1, triggerTypes: t }));
  }

  const refreshCallback = () => {
    setCurrentPage(1);
    request(merge(initFetchRequest, { currentPage: 1 }));
  }

  const columns = [
    {
      title: '部署版本',
      dataIndex: 'id',
      cell: (value, index, record) => {
        const showLinkNode = isEmpty(record.steps) ? value : (
          <Link
            className="commit-description"
            to={`/${orgName}/application/${appId}/${envName}/${value}`}
          >
            {value}
          </Link>
        );

        const showLatest = !pollingStatus.includes(record.status) && latestTaskId === value;

        return (
          <div className="flex-r" style={{ minWidth: 210 }}>
            {showLinkNode}
            {showLatest && (
              <Tag color="orange" size="small" style={{ fontStyle: 'italic', marginLeft: 8 }}>
                Latest
              </Tag>
            )}
          </div>
        );
      },
      width: 200,
    },
    {
      title: '触发方式',
      dataIndex: 'trigger_type',
      cell: (value) => <TriggerType trigger={value} />
    },
    {
      title: '触发内容',
      dataIndex: 'commit',
      cell: (value, index, row) => {
        const provider = get(row, 'provider', 'github');
        const branch = get(row, 'branch');
        const message = get(row, 'message');
        return (
          <div>
            {branch && <ShowBranch threshold={50} label={branch} url={`https://${provider}.com/${repoOwner}/${repoName}/tree/${branch}`} />}
            <div>
              {value && <CommitId
                url={`https://${provider}.com/${repoOwner}/${repoName}/commit/${value}`}
                label={value}
                icon={false}
              />}
              <Truncate
                style={{ fontSize: 12, color: '#888', marginLeft: 8 }}
                threshold={40}
                align="t"
              >{message}</Truncate>
            </div>
          </div>
        );
      },
      width: 250,
    },
    {
      title: '部署状态',
      dataIndex: 'status',
      width: 100,
      cell: (value) => <Status status={value} />,
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      width: 160,
      cell: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
      width: 160,
      cell: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'id',
      cell: (value, i, item) => {
        const updatedTime = moment(get(item, 'updated_time')).format('YYYY-MM-DD HH:mm:ss');
        const disabled = item.status !== 'success' || value === latestTaskId || startsWith(item.trigger_type, 'tracker:');
        const showLatest = !pollingStatus.includes(item.status) && latestTaskId === value;
        return (
          <Actions>
            <DeleteCommit
              appId={appId}
              taskId={value}
              refreshCallback={refreshCallback}
              updatedTime={updatedTime}
            />
            {pollingStatus.includes(item.status) && (
              <CancelDeploy
                isText
                taskId={value as string}
                appId={appId}
                repoName={repoName as string}
                refreshCallback={refreshCallback}
              />
            )}
            <Rollback
              disabled={disabled}
              appId={appId}
              refreshCallback={refreshCallback}
              taskId={value}
              btnText={showLatest ? '重新部署' : '回滚'}
            />
          </Actions>
        );
      },
    },
  ];

  return <>
    <div className="flex-r" style={{ justifyContent: 'space-between' }}>
      <div>
        <Select
          disabled={loading}
          label={"触发过滤"}
          mode="multiple"
          showSearch
          value={types}
          onChange={onTriggerChange}
          dataSource={triggerTypes.map(value => ({ value, label: TriggerTypeLable[value] }))}
          className='mr-16'
        />
        <Search
          key="2"
          shape="simple"
          placeholder="通过部署版本进行搜索"
          onSearch={onSearch}
          hasClear
          style={{ width: '400px' }}
        />
      </div>
      <RefreshButton styleObj={{ marginLeft: 8 }} refreshCallback={refreshCallback} />
    </div>

    <Table
      columns={columns}
      hasBorder={false}
      dataSource={data.result}
      loading={loading}
      style={{ margin: '10px 0 15px' }}
    />
    <Pagination
      current={currentPage}
      pageSize={pageSize}
      showJump={false}
      total={data.totalCount}
      onChange={onChangePage}
      pageSizeSelector="filter"
      pageSizeList={[5, 10, 20, 50]}
      onPageSizeChange={onPageSizeChange}
      style={{ textAlign: 'right' }}
    />
  </>
}

export default memo(TaskList);
