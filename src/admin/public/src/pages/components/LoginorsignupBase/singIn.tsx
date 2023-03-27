import React, { useEffect } from 'react';
import Auth from '@serverless-cd/auth-ui';
import { Link, history } from 'ice';
import { get } from 'lodash';
import store from '@/store';
import { localStorageSet } from '@/utils';
import './singIn.css';

const SingInupBase = (props) => {
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
      const userInfo = await userDispatchers.getUserInfo();
      localStorageSet(userInfo?.id, userInfo?.username);
      history?.push(`/${get(data, 'data.username')}/application`);
      return;
    }
  };

  const btnClick = (values) => {
    request(values);
  };
  return (
    <React.Fragment>
      <Auth title={title} type="LOGIN" onSingIn={btnClick}>
        <div className="singup-or-rememberme">
          <Link to="/signUp" style={{ textDecoration: 'underline' }}>
            没有账号？去注册
          </Link>
        </div>
      </Auth>
    </React.Fragment>
  );
};

export default SingInupBase;
