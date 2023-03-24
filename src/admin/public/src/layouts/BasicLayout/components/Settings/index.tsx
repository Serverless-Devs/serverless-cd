import React, { FC } from 'react';
import { Dropdown, Menu, Avatar } from '@alicloud/console-components';
import { logout } from '@/services/auth';
import { history, useRequest } from 'ice';
import store from '@/store';
import { get } from 'lodash';
import { stopPropagation, isAdmin } from '@/utils';

type Props = {
  orgName: string;
};

const Settings: FC<Props> = (props) => {
  const { orgName } = props;
  const { request } = useRequest(logout);
  const [userState, userDispatchers] = store.useModel('user');
  const avatar = get(userState, 'userInfo.avatar');
  const username = get(userState, 'userInfo.username', '');

  const menu = () => {
    const onLogout = () => {
      request();
      userDispatchers.removeStateInfo();
      history?.push('/login');
    };

    return (
      <Menu>
        <Menu.Item className="border-bottom">
          <span onClick={stopPropagation}>{username}</span>
        </Menu.Item>
        <Menu.Item className="border-bottom" onClick={() => history?.push('/organizations')}>
          个人设置
        </Menu.Item>
        {isAdmin(orgName) && (
          <Menu.Item className="border-bottom" onClick={() => history?.push('/team')}>
            团队管理
          </Menu.Item>
        )}
        <Menu.Item onClick={onLogout}>退出登录</Menu.Item>
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
