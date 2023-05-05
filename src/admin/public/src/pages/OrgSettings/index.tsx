import React, { useEffect, useState } from 'react';
import { useRequest, history } from 'ice';
import { Button, Icon, Table, Dialog, Balloon } from '@alicloud/console-components';
import Actions, { LinkButton } from '@alicloud/console-components-actions';
import TransferOrg from './components/TransferOrg';
import { listOrgs } from '@/services/user';
import { removeOrg } from '@/services/org';
import { listApp } from '@/services/applist';
import { Toast } from '@/components/ToastContainer';
import { get, size } from 'lodash';
import { ROLE } from '@/constants';
import store from '@/store';
import { localStorageSet, localStorageRemove } from '@/utils';
import CreateOrg from '@/pages/CreateOrg';
import { isEmpty, map } from 'lodash';

function Orgs({
  match: {
    params: { orgName },
  },
}) {
  const { data, request, refresh, loading } = useRequest(listOrgs);
  const [userState] = store.useModel('user');
  const username = get(userState, 'userInfo.username');
  const [visible, setVisible] = useState(false);
  const [orgList, setOrgList] = useState<any[]>([]);

  useEffect(() => {
    request();
  }, []);

  useEffect(() => {
    if (isEmpty(data)) return
    getOrgList()
  }, [JSON.stringify(data)]);

  const disabledType = {
    'owner': '权限不足',
    'useName': '您当前选择的团队，不可删除',
    'size': '当前团队下存在应用，不可删除',
  }

  const getOrgList = async () => {
    const result = get(data, 'result', []);
    const newOrgList = await Promise.all(
      map(result, async (item) => {
        const list = await listApp(item.name);
        return {
          ...item,
          appList: list
        }
      })
    );
    setOrgList(newOrgList);
  }

  const handleDelete = (record) => {
    const dialog = Dialog.alert({
      title: `删除团队：${record.name}`,
      content: '您确定删除当前团队吗?',
      onOk: async () => {
        const { success } = await removeOrg({ orgName: record.name });
        if (success) {
          Toast.success('团队删除成功');
          record.name === orgName && localStorageRemove(record.user_id);
          refresh();
          history?.push(`/${orgName}/profile/organizations?orgRefresh=${new Date().getTime()}`);
        }
        dialog.hide();
      },
    });
  };

  const handleChangeOrg = async (record) => {
    localStorageSet(record.user_id, record.name);
    history?.push(`/${record.name}/setting/org`);
  };

  const columns = [
    {
      title: '团队地址',
      key: 'name',
      dataIndex: 'name',
      cell: (value, _index, record) => (
        <Button type="primary" text onClick={() => handleChangeOrg(record)}>
          {value}
        </Button>
      ),
    },
    {
      title: '团队名称',
      key: 'alias',
      dataIndex: 'alias',
      cell: (value, _index, record) => value || record.name,
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
      cell: (value, _index, record) => {
        const isOwner = record.role !== ROLE.OWNER;
        const isCurrentOrgName = record.name === username;
        const appSize = size(record.appList) > 0;
        let type;
        if (isOwner) {
          type = 'owner';
        } else if (isCurrentOrgName) {
          type = 'useName'
        } else if (appSize) {
          type = 'size'
        }

        return (
          <Actions>
            <LinkButton type="primary" onClick={() => handleChangeOrg(record)}>
              切换
            </LinkButton>
            <TransferOrg callback={refresh} dataSource={{ name: record.name }}>
              <LinkButton disabled={isOwner || isCurrentOrgName}>
                转让
              </LinkButton>
            </TransferOrg>
            {
              (isOwner || isCurrentOrgName || appSize) ? (
                <Balloon
                  trigger={<Button disabled text>删除</Button>}
                  align="tl"
                  closable={false}
                  alignEdge
                  triggerType="hover"
                >
                  {disabledType[type]}
                </Balloon>
              ) : (
                <LinkButton
                  type="primary"
                  onClick={() => handleDelete(record)}
                >
                  删除
                </LinkButton>
              )
            }
          </Actions >
        )
      },
    },
  ];

  const handleCreateOrgCallback = () => {
    setVisible(false);
    return refresh();
  };

  return (
    <div className="mt-16">
      <div className="flex-r mb-16">
        <Button type="primary" onClick={() => setVisible(true)}>
          新建团队
        </Button>
        <Button onClick={refresh}>
          <Icon type="refresh" />
        </Button>
      </div>
      <Table
        loading={loading}
        hasBorder={false}
        dataSource={orgList}
        columns={columns}
      />
      <CreateOrg
        callback={handleCreateOrgCallback}
        active={visible}
        orgName={orgName}
        changeVisible={(val) => setVisible(val)}
      />
    </div>
  );
}
export default Orgs;
