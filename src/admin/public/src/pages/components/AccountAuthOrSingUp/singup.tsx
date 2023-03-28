import React, { useEffect } from 'react';
import Auth from '@serverless-cd/auth-ui';
import { useRequest, history } from 'ice';
import './index.css';
import store from '@/store';
import { accountSignUp } from '@/services/auth';

const AccountSingUp = (props) => {
  const {
    title,
    github_unionid,
    gitee_unionid,
  } = props;
  const [, userDispatchers] = store.useModel('user');
  const { data, request, loading } = useRequest(accountSignUp);

  useEffect(() => {
    goAppList();
  }, [JSON.stringify(data)]);

  const goAppList = async () => {
    if (!data) return;
    const {
      success,
      data: { username },
    } = data;
    if (success) {
      await userDispatchers.getUserInfo();
      history?.push(`/${username}/application`);
      return;
    }
  };

  const btnClick = (values) => {
    request({ ...values, github_unionid, gitee_unionid });
  };
  return (
    <React.Fragment>
      <Auth className="account-public-content" title={title} type="REGISTER" onSignUp={btnClick} accountBtnName="注册并绑定" loading={loading} />
    </React.Fragment>
  );
};

export default AccountSingUp;
