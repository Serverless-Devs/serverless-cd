import React, { useEffect, useState } from 'react';
import { useRequest, history, Link } from 'ice';
import _, { get, isEmpty } from 'lodash';
import { Avatar, Icon, Field, Button, Loading } from '@alicloud/console-components';
import { C_REPOSITORY } from '@/constants/repository';
import { accountBinding, getAuthGithub } from '@/services/auth';
import AccountForm from '../components/AccountForm';
import { getParams } from '@/utils';
import '@/pages/components/LoginorsignupBase/index.css';

const Login = ({ location: { search } }) => {
  const [bindingStatus, setBindingStatus] = useState(false);
  const [githubInfo, getGithubInfo] = useState({});
  const { request, data, loading } = useRequest(accountBinding);
  const GetAuthGithub = useRequest(getAuthGithub);
  const field = Field.useField();
  const { init, getValue, validate, getError } = field;
  const code = get(getParams(search), 'code', '');

  useEffect(() => {
    GetAuthGithub.request({ code });
  }, []);

  useEffect(() => {
    if (data && data.success) {
      history?.push('/');
    }
  }, [data]);

  useEffect(() => {
    const info = get(GetAuthGithub.data, 'data', {});
    if (!isEmpty(info)) {
      getGithubInfo(info);
    }
  }, [GetAuthGithub.data]);

  const btnClick = () => {
    validate((errors, values) => {
      if (!errors) {
        request({
          status: bindingStatus ? 'signIn' : 'login',
          ...values,
          providerInfo: githubInfo,
        });
      }
    });
  };

  return (
    <>
      {GetAuthGithub.loading ? (
        <Loading tip="授权中..." fullScreen tipAlign="bottom" />
      ) : (
        <div className="session-container" style={{ maxWidth: 500 }}>
          <h1>继续以完成第三方帐号绑定</h1>
          <div className="flex-r" style={{ justifyContent: 'center' }}>
            <Avatar
              src={
                'https://img.alicdn.com/imgextra/i3/O1CN01y2i5Eg1bcB4XM17SG_!!6000000003485-2-tps-320-320.png'
              }
            />
            <Icon type="switch" style={{ margin: '0 20px' }} />
            {C_REPOSITORY['github']?.svg(36)}
          </div>
          <p style={{ margin: '20px 0' }}>您已通过 GitHub 授权，完善以下登录信息即可完成绑定</p>
          <AccountForm init={init} getError={getError} />
          <Button
            className="base-login-button"
            type="primary"
            style={{ margin: '20px auto', width: 320 }}
            loading={loading}
            disabled={!(getValue('username') && getValue('password'))}
            onClick={btnClick}
          >
            {loading ? '绑定中' : bindingStatus ? '注册并绑定' : '登录并绑定已有账号'}
          </Button>
          <a
            className="cursor-pointer"
            style={{ textDecoration: 'underline' }}
            onClick={() => setBindingStatus(!bindingStatus)}
          >
            {bindingStatus ? '已有帐号？ 点此绑定' : '没有帐号？ 注册一个'}
          </a>
          <Link to={'/login'} className="mt-10" style={{ display: 'block' }}>
            更多登录方式
          </Link>
        </div>
      )}
    </>
  );
};

export default Login;
