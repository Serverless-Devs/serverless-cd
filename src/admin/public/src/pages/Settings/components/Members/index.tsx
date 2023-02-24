import React, { useEffect } from 'react';
import { listUsers, removeUser } from '@/services/org';
import { useRequest } from 'ice';
import { Table, Button, Icon, Dialog } from '@alicloud/console-components';
import Actions, { LinkButton } from '@alicloud/console-components-actions';
import AddMember from './components/AddMember';
import { Toast } from '@/components/ToastContainer';
import { ROLE, ROLE_LABEL } from '@/constants';
import { map } from 'lodash';

function Members() {
  const { data, request, refresh, loading } = useRequest(listUsers);

  useEffect(() => {
    request();
  }, []);

  const handleDelete = (record) => {
    const dialog = Dialog.alert({
      title: `删除成员：${record.username}`,
      content: '您确定删除当前成员吗?',
      onOk: async () => {
        const { success } = await removeUser({ inviteUserId: record.user_id });
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
      key: 'username',
      dataIndex: 'username',
    },
    {
      title: '角色',
      key: 'role',
      dataIndex: 'role',
      cell: (value, _index, record) => ROLE_LABEL[value],
    },
    {
      title: '描述',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: '操作',
      cell: (value, _index, record) => (
        <Actions>
          <AddMember
            callback={refresh}
            type="edit"
            dataSource={{ inviteUserName: record.username, role: record.role }}
          >
            <LinkButton disabled={record.role === ROLE.OWNER}>编辑</LinkButton>
          </AddMember>
          <LinkButton
            type="primary"
            disabled={record.role === ROLE.OWNER}
            onClick={() => handleDelete(record)}
          >
            删除
          </LinkButton>
        </Actions>
      ),
    },
  ];

  return (
    <div className="mt-16">
      <div className="flex-r mb-16">
        <AddMember callback={refresh} existUsers={map(data, (item) => item.username)}>
          <Button type="primary">添加成员</Button>
        </AddMember>
        <Button onClick={refresh}>
          <Icon type="refresh" />
        </Button>
      </div>
      <Table loading={loading} hasBorder={false} dataSource={data} columns={columns} />
    </div>
  );
}

export default Members;
