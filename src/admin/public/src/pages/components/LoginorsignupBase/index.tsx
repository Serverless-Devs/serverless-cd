import React, { useState } from 'react';
import { Button, Box } from '@alicloud/console-components';
import { Link } from 'ice';
import { get, map } from 'lodash';
import { C_REPOSITORY } from '@/constants/repository';
import './index.css';
import { getConsoleConfig } from '@/utils';

const loginBtnConfigs = [
  {
    loading: false,
    disabled: false,
    className: 'github-btn',
    type: 'github',
    text: 'Github 登录',
    loginText: '登录中',
  },
  {
    text: '账号登录',
    type: 'account',
    disabled: false,
    loading: false,
  },
];

const LoginorsignupBase = (props: any) => {
  const { setIsLogin } = props;
  const [platformBtn, setPlatformBtn] = useState<any[]>(loginBtnConfigs);

  const githubLoginClick = async (type) => {
    setPlatformBtn(changeLoading(type, true));
    window.location.href = getConsoleConfig('REDIRECT_URL', '');
    setPlatformBtn(changeLoading(type, false));
  };

  const accountLoginClick = async () => {
    setIsLogin(true);
  };

  const loginBtnClicks = {
    github: githubLoginClick,
    account: accountLoginClick,
  };

  const changeLoading = (type, isLoading) => {
    const list = map(platformBtn, (item) => {
      if (item.type === type) item.loading = isLoading;
      else item.disabled = isLoading;
      return item;
    });
    return list;
  };

  return (
    <div>
      <h1 style={{ color: '#000' }}>欢迎来到 Serverless CD</h1>
      <h3 style={{ marginTop: '30px' }}>请选择以下任意一种方式登录:</h3>
      <Box spacing={20} style={{ marginBottom: 15 }}>
        {platformBtn.map((itemBtn: any) => {
          const btnClassName = get(itemBtn, 'className', '');
          const btnGhost = get(itemBtn, 'ghost', false);
          const btnLoading = get(itemBtn, 'loading', false);
          const btnKey = get(itemBtn, 'key', '');
          const btnType = get(itemBtn, 'type', '');
          const btnText = get(itemBtn, 'text', '');
          const btnLoginText = get(itemBtn, 'loginText', '');
          const btnDisabled = get(itemBtn, 'disabled', false);
          const btnHandleClick = loginBtnClicks[btnType];

          return (
            <Button
              className={`base-login-button ${btnClassName}`}
              ghost={btnGhost}
              loading={btnLoading}
              disabled={btnDisabled}
              onClick={() => btnHandleClick(btnType)}
              size="large"
              key={btnKey}
            >
              {btnType && C_REPOSITORY[btnType]?.svg(24)}
              <span style={{ marginLeft: 10 }}>{btnLoading ? btnLoginText : btnText}</span>
            </Button>
          );
        })}
      </Box>
      <Link to="/signUp" style={{ textDecoration: 'underline' }}>
        没有账号？ 去注册
      </Link>
    </div>
  );
};

export default LoginorsignupBase;
