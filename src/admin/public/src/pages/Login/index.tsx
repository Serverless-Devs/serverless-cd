import React, { useState } from 'react';
import { useRequest } from 'ice';
import { get } from 'lodash';
import { Avatar } from '@alicloud/console-components';
import { LOGIN_LOGO_URL } from '@/constants/public';
import LoginorsignupBase from '@/pages/components/LoginorsignupBase';
import AccountLoginOrSignUp from '@/pages/components/AccountLoginOrSignUp';
import { accountLogin } from '@/services/auth';
import { getParams } from '@/utils';
import '@/pages/components/LoginorsignupBase/index.css';

const { github } = get(window, 'SUPPORT_LOGIN', {} as any);

const Login = ({ location: { search }}) => {
  const [isLogin, setIsLogin] = useState(false);
  const login = useRequest(accountLogin);
  const showLogin = get(getParams(search), 'type') === 'account';

  let node = <LoginorsignupBase setIsLogin={setIsLogin} />;
  if (isLogin || !github || showLogin) {
    node = <AccountLoginOrSignUp pageType="login" request={login} setIsLogin={setIsLogin} />;
  }

  return (
    <div className="session-container">
      <Avatar
        style={{ width: 128, height: 'auto' }}
        icon="account"
        src={LOGIN_LOGO_URL}
        shape="square"
      />
      {node}
    </div>
  );
};

export default Login;
