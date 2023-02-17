import React, { useEffect } from 'react';
import { listUsers, removeUser } from '@/services/org';
import { useRequest } from 'ice';
import { Table, Button, Icon, Dialog } from '@alicloud/console-components';
import AddMember from './components/AddMember';
import { Toast } from '@/components/ToastContainer';
import { ROLE } from '@/constants';
import { get } from 'lodash';

function Members() {
  const { data, request, refresh, loading } = useRequest(listUsers);

  useEffect(() => {
    request();
  }, []);

  const handleDelete = (record) => {
    const dialog = Dialog.alert({
      // TODO:name?
      title: `删除成员：${record.name}`,
      content: '您确定删除当前成员吗?',
      onOk: async () => {
        const { success } = await removeUser({ userId: record.user_id });
        if (success) {
          Toast.success('成员删除成功');
          refresh();
        }
        dialog.hide();
      },
    });
  };
  const columns = [
    {
      title: '成员',
      key: 'name',
      // TODO: username, 目前name是组织名称
      dataIndex: 'name',
    },
    {
      title: '角色',
      key: 'role',
      dataIndex: 'role',
    },
    {
      title: '描述',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: '操作',
      cell: (value, _index, record) => (
        <Button
          type="primary"
          disabled={record.role === ROLE.OWNER}
          text
          onClick={() => handleDelete(record)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div className="mt-16">
      <div className="flex-r mb-16">
        <AddMember callback={refresh}>
          <Button type="primary">添加成员</Button>
        </AddMember>
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

export default Members;
