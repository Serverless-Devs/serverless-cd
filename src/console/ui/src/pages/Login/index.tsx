import React, { useEffect, useState } from 'react';
import { useRequest } from 'ice';
import { get, isEmpty } from 'lodash';
import { Avatar } from '@alicloud/console-components';
import { LOGIN_LOGO_URL } from '@/constants/public';
import LoginorsignupBase from '@/pages/components/LoginorsignupBase';
import AccountLoginOrSignUp from '@/pages/components/AccountLoginOrSignUp';
import { accountLogin } from '@/services/auth';
import store from '@/store';
import { getParams } from '@/utils';
import '@/pages/components/LoginorsignupBase/index.css';

const Login = ({ location: { search } }) => {
  const [isLogin, setIsLogin] = useState(get(getParams(search), 'type') === 'account');
  const [loginState, loginDispatchers] = store.useModel('login');
  const login = useRequest(accountLogin);

  useEffect(() => {
    if (isEmpty(loginState.supportLoginTypes)) {
      loginDispatchers.getModelsSupportLoginTypes()
    }
  }, [])

  useEffect(() => {
    const supportLoginTypes = loginState.supportLoginTypes
    if (!isLogin && !isEmpty(supportLoginTypes)) {
      setIsLogin(!supportLoginTypes.github)
    }
  }, [loginState])

  return (
    <div className="session-container">
      <Avatar
        style={{ width: 128, height: 'auto' }}
        icon="account"
        src={LOGIN_LOGO_URL}
        shape="square"
      />
      {isLogin ? (
        <AccountLoginOrSignUp pageType="login" request={login} setIsLogin={setIsLogin} supportLoginTypes={loginState.supportLoginTypes} />
      ) : (
        <LoginorsignupBase setIsLogin={setIsLogin} />
      )}
    </div>
  );
};

export default Login;
