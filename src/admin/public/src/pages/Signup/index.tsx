import React from 'react';
import { Avatar } from '@alicloud/console-components';
import { useRequest } from 'ice';
import { get } from 'lodash';
import { LOGIN_LOGO_URL } from '@/constants/public';
import { accountSignUp } from '@/services/auth';
import { getParams } from '@/utils';
import AccountSingUp from '@/pages/components/AccountSignUp';
import '@/pages/components/AccountLogin/index.css';

const Login = ({ location: { search } }) => {
  const signUp = useRequest(accountSignUp);
  const github_unionid = get(getParams(search), 'github_unionid', '');
  const gitee_unionid = get(getParams(search), 'gitee_unionid', '');

  let title = (
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
      <AccountSingUp title={title} request={signUp} github_unionid={github_unionid} gitee_unionid={gitee_unionid} search={search} />
    </div>
  );
};

export default Login;
