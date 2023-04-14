import React, { useState, useEffect } from 'react';
import Auth from '@serverless-cd/auth-ui';
import { Link, history } from 'ice';
import './index.css';
import store from '@/store';

const AccountSingUp = (props) => {
  const {
    title,
    request: { loading, data, request },
  } = props;
  const [, userDispatchers] = store.useModel('user');

  useEffect(() => {
    goAppList();
  }, [JSON.stringify(data)]);

  const goAppList = async () => {
    if (!data) return;
    const { success } = data;
    if (success) {
      await userDispatchers.getUserInfo();
      history?.push('/');
      return;
    }
  };

  const btnClick = (values) => {
    request({ ...values });
  };
  return (
    <React.Fragment>
      <Auth
        className="account-public-content"
        title={title}
        type="REGISTER"
        onSignUp={btnClick}
        loading={loading}
      >
        <div className="already-account-sing-in">
          <Link to={'/login'} style={{ textDecoration: 'underline' }}>
            已经有账户？前往登录
          </Link>
        </div>
      </Auth>
    </React.Fragment>
  );
};

export default AccountSingUp;
