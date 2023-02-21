import React from 'react';
import { Icon } from '@alicloud/console-components';

const NotAuth = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'inherit',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Icon type="lock" size={64} />
        <h4
          style={{
            fontSize: 20,
            fontWeight: 600,
            height: 28,
            lineHeight: '28px',
            margin: '24px 0',
          }}
        >
          你没有权限访问该页面
        </h4>
      </div>
    </div>
  );
};

export default NotAuth;
