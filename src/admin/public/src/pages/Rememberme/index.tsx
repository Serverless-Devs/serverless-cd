import React from 'react';
import { Avatar } from '@alicloud/console-components';
import { useRequest } from 'ice';
import { LOGIN_LOGO_URL } from '@/constants/public';
import { accountSignUp } from '@/services/auth';
import AccountSingUp from '@/pages/components/AccountLoginOrSignUp/singUp';
import AccountLoginRememberMe from '@/pages/components/AccountLoginRememberMe';
import '@/pages/components/LoginorsignupBase/index.css';

const RememberMe = () => {
  const signUp = useRequest(accountSignUp);

  const title = (
    <div style={{ width: '100%', textAlign: 'center', marginBottom: -12 }}>
      <Avatar
        style={{ width: 128, height: 'auto' }}
        icon="account"
        src={LOGIN_LOGO_URL}
        shape="square"
      />
      <h1>注册 Serverless CD</h1>
    </div>
  );
  return (
    <div className="session-container">
      <AccountLoginRememberMe
        title={title}
      />
    </div>
  );
};

export default RememberMe;
