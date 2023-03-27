import React, { useState, useEffect } from 'react';
import { useRequest, Link, history } from 'ice';
import { get } from 'lodash';
import { Loading } from '@alicloud/console-components';
import { LOGIN_LOGO_URL } from '@/constants/public';
import '@/pages/components/AccountAuthOrSingUp/index.css';
import AccountAuth from '@/pages/components/AccountAuthOrSingUp';
import { getParams } from '@/utils';
import { accountLogin, getAuthGithub, getAuthGitee } from '@/services/auth';
import AccountAuthProcess from '../components/AccountAuthProcess';
import store from '@/store';

const LOGINTYPE = { GITHUB: 'github', GITEE: 'gitee' };
const Auth = ({ location: { search } }) => {
  const [isAuth, setAuth] = useState<string>('');
 
  const [, userDispatchers] = store.useModel('user');
  const { data, request } = useRequest(accountLogin);
  const GetAuthGithub = useRequest(getAuthGithub);
  const GetAuthGitee = useRequest(getAuthGitee);
  const code = get(getParams(search), 'code', '');
  const type = get(getParams(search), 'type', '');

  useEffect(() => {
    githubLoginOrSingup();
    giteeLoginOrSingup();
  }, [code, type]);

  useEffect(() => {
    return () => {
      setAuth('');
    }
  }, []);

  const title = <AccountAuthProcess type={type} />

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

  const githubLoginOrSingup = async() => {
    if (!code && type !== LOGINTYPE['GITHUB']) return;
    const { data: { github_unionid, id } }= await GetAuthGithub.request({ code });
    setAuth(github_unionid);
    if (!github_unionid) {
      history?.push(`/auth?type=${type}&github_unionid=${id}`);
    } else {
      request({ github_unionid: String(id) });
    }
  };

  const giteeLoginOrSingup = async() => {
    if (!code && type !== LOGINTYPE['GITEE']) return;
    const { data: { gitee_unionid, id } } = await GetAuthGitee.request({ code });
    setAuth(gitee_unionid);
    if (!gitee_unionid) {
      history?.push(`/auth?type=${type}&gitee_unionid=${id}`);
    } else {
      request({ gitee_unionid: String(id) });
    }
  };
  return (
    <div className="session-container">
      {
        GetAuthGithub.loading || GetAuthGitee.loading ? (
            <Loading tip="授权中..." fullScreen tipAlign="bottom" />
          ) : (
            <div>
                {isAuth ? <></> : <AccountAuth title={title} search={search}  />}
            </div>
          )
      }
    </div>
  );
};

export default Auth;
