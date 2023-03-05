import React, { useState } from 'react';
import { useRequest } from 'ice';
import { get } from 'lodash';
import { Avatar } from '@alicloud/console-components';
import { LOGIN_LOGO_URL } from '@/constants/public';
import LoginorsignupBase from '@/pages/components/LoginorsignupBase';
import AccountLoginOrSignUp from '@/pages/components/AccountLoginOrSignUp';
import { accountLogin } from '@/services/auth';
import { getConsoleConfig, getParams } from '@/utils';
import '@/pages/components/LoginorsignupBase/index.css';
import SingInupBase from '@/pages/components/LoginorsignupBase/singIn';

const { github } = getConsoleConfig('SUPPORT_LOGIN', {});

const Login = ({ location: { search } }) => {
  const [isLogin, setIsLogin] = useState(false);
  const login = useRequest(accountLogin);
  const showLogin = get(getParams(search), 'type') === 'account';

  let node = <LoginorsignupBase setIsLogin={setIsLogin} />;
  if (isLogin || !github || showLogin) {
    node = <AccountLoginOrSignUp pageType="login" request={login} setIsLogin={setIsLogin} />;
  }
  const title = (
    <div style={{ width: '100%', textAlign: 'center', marginBottom: -12 }}>
      <Avatar
        style={{ width: 128, height: 'auto' }}
        icon="account"
        src={LOGIN_LOGO_URL}
        shape="square"
      />
      <h1>登录 Serverless CD</h1>
    </div>
  );
  return (
    <div className="session-container">
      <SingInupBase title={title} request={login} />
      {/* {node} */}
    </div>
  );
};

export default Login;
