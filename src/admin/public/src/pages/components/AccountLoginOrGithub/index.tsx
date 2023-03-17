import React, { useEffect } from 'react';
import Auth from '@serverless-cd/auth-ui';
import { useRequest, Link, history } from 'ice';
import { get } from 'lodash';
import store from '@/store';
import './index.css';
import { getConsoleConfig, getParams } from '@/utils';
import { accountLogin, getAuthGithub } from '@/services/auth';


const { github } = getConsoleConfig('SUPPORT_LOGIN', {});

const SingInupBase = (props) => {
  const { title } = props;
  const [, userDispatchers] = store.useModel('user');

  const { data, request } = useRequest(accountLogin);

  const GetAuthGithub = useRequest(getAuthGithub);
  const { search } = window.location;
  const code = get(getParams(search), 'code', '');

  useEffect(() => {
    !!code && githubLoginOrSingup();
  }, [code]);

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
    request(values);
  };

  const githubLoginOrSingup = async() => {
    const { data: { github_unionid, id } }= await GetAuthGithub.request({ code });
    if (!github_unionid) {
      history?.push(`/signUp?github_unionid=${id}`);
    } else {
      request({ github_unionid: String(id) });
    }
  };

  const loginThirdPartyUrl = {
    githubUrl: !!github && getConsoleConfig('REDIRECT_URL', ''),
  }
  return (
    <React.Fragment>
      <Auth title={title} type="LOGIN" onSingIn={btnClick} {...loginThirdPartyUrl}>
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
