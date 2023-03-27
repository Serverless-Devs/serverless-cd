import React, { useState } from 'react';
import { Shell, ConfigProvider, Button } from '@alicloud/console-components';
import PageNav from './components/PageNav';
import ToastContainer from '@/components/ToastContainer';
import Settings from './components/Settings';
import Org from './components/Org';
import Add from './components/Add';
import Home from './components/Home';
import { get } from 'lodash';
import { getOrgName } from '@/utils';
import { menuConfig } from '@/constants/navConfig';
import './index.less';

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
  const orgName = get(match, 'params.orgName', getOrgName());

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

  const showMenu = menuConfig.includes(pathname);

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
          <Home />
          <Org orgName={orgName} />
        </Shell.Branding>
        <Shell.Action>
          {match?.path !== '/login' && (
            <>
              <Add orgName={orgName} />
              <Button
                type="primary"
                className="mr-16"
                text
                component="a"
                href="http://serverless-cd.cn"
                target="_blank"
              >
                帮助文档
              </Button>
              <Settings orgName={orgName} />
            </>
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
