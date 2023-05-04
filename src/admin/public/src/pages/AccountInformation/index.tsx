import React, { FC } from 'react';
import { Tab } from '@alicloud/console-components';
import './index.less';
import AccountInfo from './components/AccountInfo';

type Props = {};

const AccountInformation: FC<Props> = (props) => {
  return (
    <div className="account-content">
      <Tab>
        <Tab.Item title="账号信息">
          <AccountInfo/>
        </Tab.Item>
      </Tab>  
    </div>
  );
};

export default AccountInformation;
