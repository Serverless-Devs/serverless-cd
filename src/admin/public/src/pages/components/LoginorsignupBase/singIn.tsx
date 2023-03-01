import React, { useEffect } from 'react';
import Auth from '@serverless-cd/auth-ui';
import { Link, history } from 'ice';
import store from '@/store';
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
  return (
    <React.Fragment>
      <Auth
        title={title}
        type="LOGINEMAIL"
        onSingIn={btnClick}
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

export default SingInupBase;