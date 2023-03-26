import React, { useState } from 'react';
import { useRequest } from 'ice';
import { get } from 'lodash';
import { Avatar } from '@alicloud/console-components';
import { LOGIN_LOGO_URL } from '@/constants/public';
import { getParams } from '@/utils';
import '@/pages/components/AccountLogin/index.css';
import SingIn from '@/pages/components/AccountLogin';

const Login = ({ location: { search } }) => {
  const [isLogin, setIsLogin] = useState(false);
  const showLogin = get(getParams(search), 'type') === 'account';

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
      <SingIn title={title}  />
    </div>
  );
};

export default Login;
