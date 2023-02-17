import React, { useState } from 'react';
import PageLayout from '@/layouts/PageLayout';
import { Tab } from '@alicloud/console-components';
import Secrets from './components/Secrets';
import Members from './components/Members';
import { getParam } from '@/utils';

function Settings() {
  const defaultActiveKey = getParam('activeTab') || 'members';

  const [activeKey, setActiveKey] = useState(defaultActiveKey as string);
  return (
    <PageLayout
      breadcrumbs={[
        {
          name: '设置',
        },
      ]}
    >
      <Tab activeKey={activeKey} onChange={(val: string) => setActiveKey(val)}>
        <Tab.Item key="members" title="成员管理">
          <Members />
        </Tab.Item>
        <Tab.Item key="secrets" title="密钥配置">
          <Secrets />
        </Tab.Item>
      </Tab>
    </PageLayout>
  );
}

export default Settings;
