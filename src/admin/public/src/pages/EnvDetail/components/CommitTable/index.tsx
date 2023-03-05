import React, { memo, useEffect, useState, FC } from 'react';
import { Table, Pagination, Search, Tag } from '@alicloud/console-components';
import { Link, useRequest } from 'ice';
import { getTaskList } from '@/services/task';
import { get } from 'lodash';
import CommitId from '@/components/CommitId';
import moment from 'moment';
import Status from '@/components/DeployStatus';
import DeleteCommit from '../DeleteCommit';
import RefreshButton from '../RefreshButton';
import { pollingStatus } from '@/constants';

interface IProps {
  appId: string;
  envName: string;
  orgName: string;
  latestTaskId?: string;
}

const PAGE_SIZE = 10;

const CommitTable: FC<IProps> = (props) => {
  const { appId, latestTaskId, envName, orgName } = props;
  const { loading, data, request, refresh } = useRequest(getTaskList);
  const [taskList, setTaskList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    request({ appId, envName, pageSize: PAGE_SIZE, currentPage: 1 });
  }, [appId]);

  useEffect(() => {
    setTaskList(get(data, 'result', []));
    setTotalCount(Number(get(data, 'totalCount', 0)));
  }, [data]);

  const columns = [
    {
      title: '部署版本',
      dataIndex: 'id',
      cell: (value, index, record) => {
        return (
          <>
            <Link
              className="commit-description"
              to={`/${orgName}/application/${appId}/${envName}/${value}`}
            >
              {value}
            </Link>
            {!pollingStatus.includes(record.status) && latestTaskId === value && (
              <Tag color="orange" size="small" style={{ fontStyle: 'italic', marginLeft: 8 }}>
                Latest
              </Tag>
            )}
          </>
        );
      },
      width: 200,
    },
    {
      title: '最新提交',
      dataIndex: 'commit',
      cell: (value, index, row) => {
        const provider = get(row, 'provider', 'github');
        const owner = get(row, 'username');
        const repo_name = get(row, 'repo_name');
        const branch = get(row, 'branch');
        const message = get(row, 'message');
        return (
          <div>
            <span>{branch}</span>
            <div>
              <CommitId
                // className="ml-4"
                url={`https://${provider}.com/${owner}/${repo_name}/commit/${value}`}
                label={value}
                icon={false}
              />
              <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>{message}</span>
            </div>
          </div>
        );
      },
      width: 250,
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      cell: (value) => <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
      cell: (value) => <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '部署状态',
      dataIndex: 'status',
      cell: (value) => <Status status={value} />,
    },
    {
      title: '操作',
      dataIndex: 'id',
      cell: (value, i, item) => {
        const updatedTime = moment(get(item, 'updated_time')).format('YYYY-MM-DD HH:mm:ss');
        return (
          <DeleteCommit
            appId={appId}
            taskId={value}
            refreshCallback={refresh}
            updatedTime={updatedTime}
          />
        );
      },
    },
  ];

  const onSearch = (taskId: string) => {
    request({ appId, envName, pageSize: PAGE_SIZE, currentPage: 1, taskId });
  };

  const onChangePage = (currentPage) => {
    request({ appId, envName, pageSize: PAGE_SIZE, currentPage });
  };

  return (
    <div style={{ padding: '0' }}>
      <div className="flex-r" style={{ justifyContent: 'space-between' }}>
        <Search
          key="2"
          shape="simple"
          placeholder="通过部署版本进行搜索"
          onSearch={onSearch}
          hasClear
          style={{ width: '400px' }}
        />
        <RefreshButton styleObj={{ marginLeft: 8 }} refreshCallback={refresh} />
      </div>

      <Table
        columns={columns}
        hasBorder={false}
        dataSource={taskList}
        loading={loading}
        style={{ margin: '10px 0 15px' }}
      />
      <Pagination
        pageSize={PAGE_SIZE}
        showJump={false}
        total={totalCount}
        onChange={onChangePage}
        style={{ textAlign: 'right' }}
      />
    </div>
  );
};
export default memo(CommitTable);
