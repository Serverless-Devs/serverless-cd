import React, { useEffect } from 'react';
import { useRequest, history } from 'ice';
import { Tab } from '@alicloud/console-components';
import { get, map } from 'lodash';
import store from '@/store';
import './index.css';
import { getParams } from '@/utils';
import { accountLogin } from '@/services/auth';
import Auth from './auth';
import SingUp from './singup';


const AccountAuth = (props) => {
  const { title, search } = props;
  const [, userDispatchers] = store.useModel('user');

  const { data } = useRequest(accountLogin);
  const github_unionid = get(getParams(search), 'github_unionid', '');
  const gitee_unionid = get(getParams(search), 'gitee_unionid', '');

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

  const Tabs = [
    {
      title: '账号授权',
      key: 'auth',
      content: <Auth title={title} search={search} />
    },
    {
      title: '新用户注册',
      key: 'singup',
      content: <SingUp title={title} search={search} github_unionid={github_unionid} gitee_unionid={gitee_unionid} />
    }
  ];
  return (
    <React.Fragment>
      <Tab>
        {
          map(Tabs, item => {
            return <Tab.Item title={item.title} key={item.key} >{item.content}</Tab.Item>
          })
        }
      </Tab>
    </React.Fragment>
  );
};

export default AccountAuth;
