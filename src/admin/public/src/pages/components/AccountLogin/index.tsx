import React, { useEffect, useState } from 'react';
import Auth from '@serverless-cd/auth-ui';
import { useRequest, Link, history } from 'ice';
import { get } from 'lodash';
import store from '@/store';
import './index.css';
import { getConsoleConfig, getParams } from '@/utils';
import { accountLogin, getAuthGithub, getAuthGitee } from '@/services/auth';

const { github, gitee } = getConsoleConfig('SUPPORT_LOGIN', {});
const LOGINTYPE = { GITHUB: 'github', GITEE: 'gitee' };

const AccountLogin = (props) => {
  const { title } = props;
  const [, userDispatchers] = store.useModel('user');
  const [thirdPartyLoading, setThirdPartyLoading] = useState({
    githubLoading: false,
    giteeLoading: false,
  });

  const { data, request, loading } = useRequest(accountLogin);

  const GetAuthGithub = useRequest(getAuthGithub);
  const GetAuthGitee = useRequest(getAuthGitee);
  const { search } = window.location;
  const code = get(getParams(search), 'code', '');
  const type = get(getParams(search), 'type', '');

  useEffect(() => {
    !!code && type === LOGINTYPE['GITHUB'] && githubLoginOrSingup();
    !!code && type === LOGINTYPE['GITEE'] && giteeLoginOrSingup();
  }, [code, type]);

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
      history?.push('/');
      return;
    }
  };

  const btnClick = (values) => {
    request(values);
  };

  const githubLoginOrSingup = async () => {
    setThirdPartyLoading({ githubLoading: true, giteeLoading: false });
    const {
      data: { github_unionid, id },
    } = await GetAuthGithub.request({ code });
    setThirdPartyLoading({ githubLoading: false, giteeLoading: false });
    if (!github_unionid) {
      history?.push(`/signUp?github_unionid=${id}`);
    } else {
      request({ github_unionid: String(id) });
    }
  };

  const giteeLoginOrSingup = async () => {
    setThirdPartyLoading({ githubLoading: false, giteeLoading: true });
    const {
      data: { gitee_unionid, id },
    } = await GetAuthGitee.request({ code });
    setThirdPartyLoading({ githubLoading: false, giteeLoading: false });
    if (!gitee_unionid) {
      history?.push(`/signUp?gitee_unionid=${id}`);
    } else {
      request({ github_unionid: String(id) });
    }
  };

  const ThirdPartyConfig = [
    {
      type: 'github',
      url: github ? getConsoleConfig('GITHUB_REDIRECT_URI', '') : '',
      loading: thirdPartyLoading['githubLoading'],
    },
    {
      type: 'gitee',
      url: gitee ? getConsoleConfig('GITEE_REDIRECT_URI', '') : '',
      loading: thirdPartyLoading['gieeLoading'],
    },
  ];
  return (
    <React.Fragment>
      <Auth
        className="account-public-content"
        title={title}
        type="LOGIN"
        onSingIn={btnClick}
        loading={loading}
        thirdPartyConfig={ThirdPartyConfig}
      >
        <div className="singup-or-rememberme">
          <Link to="/signUp" style={{ textDecoration: 'underline' }}>
            没有账号？去注册
          </Link>
        </div>
      </Auth>
    </React.Fragment>
  );
};

export default AccountLogin;
