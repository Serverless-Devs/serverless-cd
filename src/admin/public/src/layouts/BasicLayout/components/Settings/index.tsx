import React, { FC } from 'react';
import { Dropdown, Menu, Avatar } from '@alicloud/console-components';
import Icon, { UserOutlined, FormOutlined, TeamOutlined } from '@ant-design/icons';
import { logout } from '@/services/auth';
import { history, useRequest } from 'ice';
import store from '@/store';
import { get, unset } from 'lodash';
import { stopPropagation, isAdmin } from '@/utils';
import { ORG_NAME, CUSTOMICON } from '@/constants';

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
      unset(window, ORG_NAME);
      userDispatchers.removeStateInfo();
      history?.push('/login');
    };

    const LogOutIcon = (props) => (
      <Icon component={CUSTOMICON['LOGOUT']} {...props} />
    );
    const MENUICON = {
      USERNAME: <UserOutlined style={{ marginRight: '6px' }} />,
      PERSONALSET: <FormOutlined style={{ marginRight: '6px' }} />,
      TEAMMANAGEMENT: <TeamOutlined style={{ marginRight: '6px' }} />,
      LOGOUT: <LogOutIcon style={{ marginRight: '6px' }} />,
    }

    return (
      <Menu className="top-bar-menu__wrapper">
        <Menu.Item className="border-bottom">
          {MENUICON.USERNAME}<span onClick={stopPropagation}>{username}</span>
        </Menu.Item>
        <Menu.Item className="border-bottom" onClick={() => history?.push(`/${orgName}/profile/organizations`)}>
          {MENUICON.PERSONALSET}个人设置
        </Menu.Item>
        {isAdmin(orgName) && (
          <Menu.Item className="border-bottom" onClick={() => history?.push(`/${orgName}/team`)}>
            {MENUICON.TEAMMANAGEMENT}团队管理
          </Menu.Item>
        )}
        <Menu.Item onClick={onLogout}>
           {MENUICON.LOGOUT}退出登录
        </Menu.Item>
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
      align="tr br"
    >
      {menu()}
    </Dropdown>
  );
};

export default Settings;
