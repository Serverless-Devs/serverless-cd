import React, { useState } from 'react';
import PageLayout from '@/layouts/PageLayout';
import { Tab } from '@alicloud/console-components';
import Orgs from './components/Orgs';
import AccountInfo from './components/AccountInfo'
import { getParam } from '@/utils';

function Settings() {
  const defaultActiveKey = getParam('activeTab') || 'orgs';

  const [activeKey, setActiveKey] = useState(defaultActiveKey as string);
  return (
    <PageLayout
      breadcrumbs={[
        {
          name: '首页',
          path: '/',
        },
        {
          name: '个人设置',
        },
      ]}
    >
      <Tab shape="wrapped" activeKey={activeKey} onChange={(val: string) => setActiveKey(val)}>
        <Tab.Item key="orgs" title="团队管理">
          <Orgs />
        </Tab.Item>
        <Tab.Item key="userinfo" title="账号信息">
          <AccountInfo />
        </Tab.Item>
      </Tab>
    </PageLayout>
  );
}

export default Settings;
