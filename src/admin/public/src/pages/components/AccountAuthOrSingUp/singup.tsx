import React, { useEffect } from 'react';
import Auth from '@serverless-cd/auth-ui';
import { get } from 'lodash';
import store from '@/store';
import { localStorageSet } from '@/utils';
import { useRequest, history } from 'ice';
import './index.css';
import { accountSignUp } from '@/services/auth';

const AccountSingUp = (props) => {
  const { title, github_unionid, gitee_unionid } = props;
  const [, userDispatchers] = store.useModel('user');
  const { data, request } = useRequest(accountSignUp);

  useEffect(() => {
    goAppList();
  }, [JSON.stringify(data)]);

  const goAppList = async () => {
    if (!data) return;
    const { success } = data;
    if (success) {
      const userInfo = await userDispatchers.getUserInfo();
      localStorageSet(userInfo?.id, userInfo?.username);
      history?.push(`/${get(data, 'data.username')}/application`);
      return;
    }
  };

  const btnClick = (values) => {
    request({ ...values, github_unionid, gitee_unionid });
  };
  return (
    <React.Fragment>
      <Auth
        className="account-public-content"
        title={title}
        type="REGISTER"
        onSignUp={btnClick}
        accountBtnName="注册并绑定"
      />
    </React.Fragment>
  );
};

export default AccountSingUp;
