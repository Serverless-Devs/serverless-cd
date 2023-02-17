import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import { Tab } from '@alicloud/console-components';
import Secrets from './components/Secrets';
import Members from './components/Members';
import Orgs from './components/Orgs';

function Settings({
  match: {
    params: { orgName },
  },
}) {
  return (
    <PageLayout
      title={orgName}
      breadcrumbs={[
        {
          name: '设置',
        },
      ]}
    >
      <Tab>
        <Tab.Item key="members" title="成员管理">
          <Members />
        </Tab.Item>
        <Tab.Item key="secrets" title="密钥配置">
          <Secrets />
        </Tab.Item>
        <Tab.Item key="orgs" title="组织管理">
          <Orgs />
        </Tab.Item>
      </Tab>
    </PageLayout>
  );
}

export default Settings;
