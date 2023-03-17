import React, { useEffect, FC } from 'react';
import { Dropdown, Menu, Avatar, Icon } from '@alicloud/console-components';
import { logout } from '@/services/auth';
import { history, useRequest } from 'ice';
import store from '@/store';
import { get, map } from 'lodash';
import { listOrgs } from '@/services/user';
import style from 'styled-components';
import { localStorageSet } from '@/utils';

const StyledMenu = style.div`
.next-menu{
  width: 180px;
  border: 1px solid #dadee3;
  border-radius: .28571429rem;
  box-shadow: 0 4px 8px -2px rgb(9 30 66 / 25%), 0 0 1px 0 rgb(9 30 66 / 31%);
  .next-menu-item{
    padding: 4px 16px;
  }
  .border-bottom {
    border-bottom: 1px solid #e3e9ed!important;
  }
}
`;

const OrgMenu = style.div`
left: unset !important;
right: 200px;
.next-menu{
  width: 150px;
  border: 1px solid #dadee3;
  border-radius: .28571429rem;
  box-shadow: 0 4px 8px -2px rgb(9 30 66 / 25%), 0 0 1px 0 rgb(9 30 66 / 31%);
  .next-menu-item{
    padding: 4px 16px;
  }
}
`;

type Props = {
  orgName: string;
};

const Settings: FC<Props> = (props) => {
  const { orgName } = props;
  const { request } = useRequest(logout);
  const orgRequest = useRequest(listOrgs);
  const [userState, userDispatchers] = store.useModel('user');
  const avatar = get(userState, 'userInfo.avatar');
  const username = get(userState, 'userInfo.username', '');

  useEffect(() => {
    orgRequest.request();
  }, []);

  const menu = () => {
    const onItemClick = (key) => {
      if (key === '/username') return;
      if (key === '/login') {
        request();
        userDispatchers.removeStateInfo();
        return history?.push(key);
      }
      history?.push(`/${username}${key}`);
    };
    const stopEvent = async (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    const handleChangeOrg = async (value: string) => {
      localStorageSet('orgName', value);
      history?.push('/');
    };
    const orgRender = (
      <Dropdown
        trigger={
          <div onClick={stopEvent} className="flex-r">
            <span className="ellipsis">团队切换({orgName})</span>
            <Icon type="arrow-right" size="xs" style={{ color: '#888' }} />
          </div>
        }
        offset={[0, -38]}
      >
        <OrgMenu>
          <Menu>
            {map(get(orgRequest, 'data.result'), (item) => {
              return (
                <Menu.Item>
                  <div className="flex-r" onClick={() => handleChangeOrg(item.name)}>
                    <span className="ellipsis">{item.name}</span>
                    {orgName === item.name && (
                      <Icon type="select" size="xs" style={{ color: '#0070cc' }} />
                    )}
                  </div>
                </Menu.Item>
              );
            })}
          </Menu>
        </OrgMenu>
      </Dropdown>
    );
    return (
      <StyledMenu>
        <Menu onItemClick={onItemClick}>
          <Menu.Item key="/username" className="border-bottom">
            <span>{username}</span>
          </Menu.Item>
          <Menu.Item key="/application">应用管理</Menu.Item>
          <Menu.Item>{orgRender}</Menu.Item>
          <Menu.Item key="/settings" className="border-bottom">
            设置
          </Menu.Item>
          <Menu.Item key="/login">退出登录</Menu.Item>
        </Menu>
      </StyledMenu>
    );
  };
  return (
    <Dropdown
      trigger={
        <div style={{ padding: '12px 8px' }}>
          {avatar ? (
            <Avatar className="cursor-pointer" src={avatar} size="small" />
          ) : (
            <div className="avatar-content cursor-pointer">{username.slice(0, 1)}</div>
          )}
        </div>
      }
      offset={[0, 0]}
    >
      {menu()}
    </Dropdown>
  );
};

export default Settings;
