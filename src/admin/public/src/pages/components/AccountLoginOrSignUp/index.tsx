import React, { useEffect } from 'react';
import { Link, history } from 'ice';
import { Button, Box, Field } from '@alicloud/console-components';
import AccountForm from '../AccountForm';
import { getConsoleConfig } from '@/utils';
import store from '@/store';

const PAGE_CONFIG = {
  login: {
    title: '登录 Serverless CD',
    // description: '输入您的账号名称和账号密码。',
    btnText: '登录',
    type: 'login',
    linkTo: '/signUp',
    linkText: '没有账号？去注册',
  },
  signUp: {
    title: '创建一个 Serverless CD 帐号',
    // description: 'Sign up with your email and a password.',
    btnText: '注册并登录',
    type: 'signUp',
    linkTo: '/login?type=account',
    linkText: '已经有账户? 去登录',
  },
};

const supportLoginTypes = getConsoleConfig('SUPPORT_LOGIN', {});

interface Props {
  pageType: string;
  request: any;
  setIsLogin?: Function;
}

const AccountLoginOrSignUp = (props: Props) => {
  const {
    pageType,
    request: { loading, data, request },
    setIsLogin,
  } = props;
  const { title, btnText, linkTo, linkText } = PAGE_CONFIG[pageType];
  const field = Field.useField();
  const { init, getValue, validate, getError } = field;
  const [, userDispatchers] = store.useModel('user');

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

  useEffect(() => {
    goAppList();
  }, [JSON.stringify(data)]);

  const btnClick = () => {
    validate((errors, values) => {
      if (!errors) {
        request(values);
      }
    });
  };

  return (
    <Box>
      <h1 style={{ color: '#000', marginBottom: 20 }}>{title}</h1>
      <AccountForm init={init} getError={getError} />
      <Button
        className="base-login-button"
        type="primary"
        style={{ margin: '10px 0' }}
        loading={loading}
        disabled={!(getValue('username') && getValue('password'))}
        onClick={btnClick}
      >
        {btnText}
      </Button>
      <Link to={linkTo} style={{ textDecoration: 'underline' }}>
        {linkText}
      </Link>
      {supportLoginTypes?.github ? (
        pageType === 'signUp' ? (
          <Link to={'/login'}>更多登录方式</Link>
        ) : (
          <a
            href="javascript:;"
            onClick={() => {
              setIsLogin && setIsLogin(false);
            }}
          >
            更多登录方式
          </a>
        )
      ) : null}
    </Box>
  );
};

export default AccountLoginOrSignUp;
