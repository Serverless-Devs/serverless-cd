import React, { useState } from 'react';
import {
  Shell,
  ConfigProvider,
  Dropdown,
  Menu,
  Avatar,
  Divider,
} from '@alicloud/console-components';
import PageNav from './components/PageNav';
import Logo from './components/Logo';
import { LOGO_URL } from '@/constants/public';
import { logout } from '@/services/auth';
import { history, useRequest } from 'ice';
import store from '@/store';
import { get } from 'lodash';
import ToastContainer from '@/components/ToastContainer';
import './index.css';

const menuConfig = ['/settings/tokens', '/settings/secrets'];

(function () {
  const throttle = function (type: string, name: string, obj: Window = window) {
    let running = false;

    const func = () => {
      if (running) {
        return;
      }

      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  if (typeof window !== 'undefined') {
    throttle('resize', 'optimizedResize');
  }
})();

interface IGetDevice {
  (width: number): 'phone' | 'tablet' | 'desktop';
}

interface IBasicLayoutProps {
  children: React.ReactNode;
  match: object | any;
  location: object | any;
}
export function BasicLayout({ children, match, location: { pathname } }: IBasicLayoutProps) {
  const { orgName } = match.params;
  const getDevice: IGetDevice = (width) => {
    const isPhone =
      typeof navigator !== 'undefined' && navigator && navigator.userAgent.match(/phone/gi);

    if (width < 680 || isPhone) {
      return 'phone';
    } else if (width < 1280 && width > 680) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };

  const [device, setDevice] = useState(getDevice(NaN));
  const [isCollapse, setIsCollapse] = useState<any>(false);
  const { request } = useRequest(logout);
  const [userState, userDispatchers] = store.useModel('user');
  const avatar = get(userState, 'userInfo.avatar');
  const username = get(userState, 'userInfo.username', '');
  // const showMenu = menuConfig.includes(pathname);
  const showMenu = false;

  const menu = () => {
    const onItemClick = (key) => {
      if (key === '/username') return;
      if (key === '/login') {
        request();
        userDispatchers.removeStateInfo();
        return history?.push(key);
      }
      if (key === '/organizations') {
        return history?.push(key);
      }
      history?.push(`/${username}${key}`);
    };
    return (
      <Menu className="user-menu" onItemClick={onItemClick}>
        <Menu.Item key="/username">
          <span className="user-name">{username}</span>
        </Menu.Item>
        <Divider key="divider1" className="m-t-b-10" />
        <Menu.Item key="/application">应用管理</Menu.Item>
        <Menu.Item key="/organizations">团队管理</Menu.Item>
        <Divider key="divider2" className="m-t-b-10" />
        <Menu.Item key="/settings" className="m-t-b-10">
          个人设置
        </Menu.Item>
        <Divider key="divider4" className="m-t-b-10" />
        <Menu.Item key="/login">退出登录</Menu.Item>
      </Menu>
    );
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('optimizedResize', (e) => {
      const deviceWidth = (e && e.target && (e.target as Window).innerWidth) || NaN;
      setDevice(getDevice(deviceWidth));
    });
  }

  return (
    <ConfigProvider device={device}>
      <Shell
        style={{
          minHeight: '100vh',
        }}
        type="light"
        fixedHeader={false}
      >
        <Shell.Branding>
          <Logo image={LOGO_URL} url={`/${orgName}/application`} />
        </Shell.Branding>
        {match?.path !== '/login' && (
          <Shell.Action>
            <Dropdown
              trigger={
                avatar ? (
                  <Avatar className="cursor-pointer" src={avatar} size="small" />
                ) : (
                  <div className="avatar-content cursor-pointer">{username.slice(0, 1)}</div>
                )
              }
              triggerType={['click']}
              offset={[0, 0]}
            >
              {menu()}
            </Dropdown>
          </Shell.Action>
        )}
        {showMenu && (
          <Shell.Navigation
            direction={'ver'}
            onCollapseChange={(collapse) => setIsCollapse(collapse)}
            collapse={isCollapse}
          >
            <PageNav />
          </Shell.Navigation>
        )}
        <Shell.Content>
          {children}
          <ToastContainer />
        </Shell.Content>
      </Shell>
    </ConfigProvider>
  );
}
