import React from 'react';
import { Avatar } from '@alicloud/console-components';
import { useRequest } from 'ice';
import { LOGIN_LOGO_URL } from '@/constants/public';
import { accountSignUp } from '@/services/auth';
import AccountLoginOrSignUp from '@/pages/components/AccountLoginOrSignUp';
import AccountSingUp from '@/pages/components/AccountLoginOrSignUp/singUp';
import '@/pages/components/LoginorsignupBase/index.css';

const Login = () => {
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
      {/* <Avatar
        style={{ width: 128, height: 'auto' }}
        icon="account"
        src={LOGIN_LOGO_URL}
        shape="square"
      />
      <AccountLoginOrSignUp pageType="signUp" request={signUp} /> */}
      <AccountSingUp title={title} request={signUp} />
    </div>
  );
};

export default Login;
