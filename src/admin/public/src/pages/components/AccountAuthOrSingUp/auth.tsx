import React, { useEffect } from 'react';
import Auth from '@serverless-cd/auth-ui';
import { useRequest, Link, history } from 'ice';
import { Tab } from '@alicloud/console-components';
import { get } from 'lodash';
import store from '@/store';
import './index.css';
import { getParams } from '@/utils';
import { accountLogin, accountSingupAuth } from '@/services/auth';

const AccountAuth = (props) => {
  const { title, search } = props;
  const [, userDispatchers] = store.useModel('user');

  const { data, request, loading } = useRequest(accountLogin);
  const AccountSingupAuth = useRequest(accountSingupAuth);
  const github_unionid = get(getParams(search), 'github_unionid', '');
  const gitee_unionid = get(getParams(search), 'gitee_unionid', '');

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

  const btnClick = async (values) => {
    const params = { ...values, github_unionid, gitee_unionid };
    const { success, data } = await AccountSingupAuth.request(params);
    if (!data) return;
    success && request(params);
  };

  return (
    <React.Fragment>
      <Auth
        className="account-public-content"
        title={title}
        type="LOGIN"
        onSingIn={btnClick}
        accountBtnName="登录并绑定已有账号"
        loading={loading}
      />
    </React.Fragment>
  );
};

export default AccountAuth;
