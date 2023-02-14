import React from 'react';
import { Avatar } from '@alicloud/console-components';
import { useRequest } from 'ice';
import { LOGIN_LOGO_URL } from '@/constants/public';
import { accountSignUp } from '@/services/auth';
import AccountLoginOrSignUp from '@/pages/components/AccountLoginOrSignUp';
import '@/pages/components/LoginorsignupBase/index.css';

const Login = () => {
  const signUp = useRequest(accountSignUp);

  return (
    <div className="session-container">
      <Avatar
        style={{ width: 128, height: 'auto' }}
        icon="account"
        src={LOGIN_LOGO_URL}
        shape="square"
      />
      <AccountLoginOrSignUp pageType="signUp" request={signUp} />
    </div>
  );
};

export default Login;
