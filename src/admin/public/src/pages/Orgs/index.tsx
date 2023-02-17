import React, { useEffect } from 'react';
import { useRequest } from 'ice';
import { Button, Icon, Table } from '@alicloud/console-components';
import CreateOrg from './components/CreateOrg';
import { listOrgs } from '@/services/user';
import { get } from 'lodash';
import { ROLE } from '@/constants';

function Orgs() {
  const { data, request, refresh, loading } = useRequest(listOrgs);

  useEffect(() => {
    request();
  }, []);

  const handleDelete = (record) => {};

  const columns = [
    {
      title: '组织名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '操作',
      cell: (value, _index, record) => (
        <Button
          type="primary"
          text
          disabled={record.role === ROLE.OWNER}
          onClick={() => handleDelete(record)}
        >
          离开
        </Button>
      ),
    },
  ];

  return (
    <div className="mt-16">
      <div className="flex-r mb-16">
        <CreateOrg callback={refresh}>
          <Button type="primary">创建组织</Button>
        </CreateOrg>
        <Button onClick={refresh}>
          <Icon type="refresh" />
        </Button>
      </div>
      <Table
        loading={loading}
        hasBorder={false}
        dataSource={get(data, 'result')}
        columns={columns}
      />
    </div>
  );
}
export default Orgs;
