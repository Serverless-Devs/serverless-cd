import React from 'react';
import Auth from '@serverless-cd/auth-ui';
import { Link } from 'ice';
import './index.css';

const AccountLoginRememberMe = (props) => {
  const { title } = props;

  return (
    <React.Fragment>
      <Auth title={title} type="REMEMBER">
        <div className="already-account-sing-in">
          <div>Already have an account?</div>
          <Link to="/login" style={{ textDecoration: 'underline' }}>
            Sing In
          </Link>
        </div>
      </Auth>
    </React.Fragment>
  );
};

export default AccountLoginRememberMe;
