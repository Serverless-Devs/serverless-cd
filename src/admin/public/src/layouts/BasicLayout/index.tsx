import React, { useState, useEffect } from 'react';
import {
  Shell,
  ConfigProvider,
  Dropdown,
  Menu,
  Avatar,
  Icon,
  Button,
} from '@alicloud/console-components';
import PageNav from './components/PageNav';
import Logo from './components/Logo';
import { LOGO_URL } from '@/constants/public';
import { logout } from '@/services/auth';
import { history, useRequest } from 'ice';
import store from '@/store';
import { get, map } from 'lodash';
import ToastContainer from '@/components/ToastContainer';
import { listOrgs } from '@/services/user';
import style from 'styled-components';
import { localStorageGet, localStorageSet } from '@/utils';

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
export function BasicLayout({ children, match }: IBasicLayoutProps) {
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
  const orgRequest = useRequest(listOrgs);
  const [userState, userDispatchers] = store.useModel('user');
  const avatar = get(userState, 'userInfo.avatar');
  const username = get(userState, 'userInfo.username', '');
  // const showMenu = menuConfig.includes(pathname);
  const showMenu = false;

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
            <span className="ellipsis">团队切换({localStorageGet('orgName')})</span>
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
                    {localStorageGet('orgName') === item.name && (
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
          <Logo image={LOGO_URL} url={`/${localStorageGet('orgName')}/application`} />
        </Shell.Branding>

        <Shell.Action>
          <Button
            type="primary"
            className="mr-8"
            text
            component="a"
            href="http://serverless-cd.cn"
            target="_blank"
          >
            帮助文档
          </Button>
          {match?.path !== '/login' && (
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
          )}
        </Shell.Action>
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
