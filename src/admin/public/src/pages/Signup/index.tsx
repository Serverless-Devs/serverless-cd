import React, { useEffect, useState } from 'react';
import { Avatar } from '@alicloud/console-components';
import { useRequest } from 'ice';
import { LOGIN_LOGO_URL } from '@/constants/public';
import { accountSignUp, getSupportLoginTypes } from '@/services/auth';
import AccountLoginOrSignUp from '@/pages/components/AccountLoginOrSignUp';
import store from '@/store';
import '@/pages/components/LoginorsignupBase/index.css';
import { isEmpty } from 'lodash';

const Login = () => {
  const signUp = useRequest(accountSignUp);
  const [loginState, loginDispatchers] = store.useModel('login');

  useEffect(() => {
    if (isEmpty(loginState.supportLoginTypes)) {
      loginDispatchers.getModelsSupportLoginTypes()
    }
  }, [])

  return (
    <div className="session-container">
      <Avatar
        style={{ width: 128, height: 'auto' }}
        icon="account"
        src={LOGIN_LOGO_URL}
        shape="square"
      />
      <AccountLoginOrSignUp pageType="signUp" request={signUp} supportLoginTypes={loginState.supportLoginTypes} />
    </div>
  );
};

export default Login;
