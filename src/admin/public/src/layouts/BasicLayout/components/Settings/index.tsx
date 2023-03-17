import React, { FC } from 'react';
import { Dropdown, Menu, Avatar } from '@alicloud/console-components';
import { logout } from '@/services/auth';
import { history, useRequest } from 'ice';
import store from '@/store';
import { get } from 'lodash';

type Props = {};

const Settings: FC<Props> = (props) => {
  const { request } = useRequest(logout);
  const [userState, userDispatchers] = store.useModel('user');
  const avatar = get(userState, 'userInfo.avatar');
  const username = get(userState, 'userInfo.username', '');

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

    return (
      <Menu onItemClick={onItemClick}>
        <Menu.Item key="/username" className="border-bottom">
          <span>{username}</span>
        </Menu.Item>
        <Menu.Item key="/settings" className="border-bottom">
          个人设置
        </Menu.Item>
        <Menu.Item key="/login">退出登录</Menu.Item>
      </Menu>
    );
  };
  return (
    <Dropdown
      trigger={
        <div className="layout-center">
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
