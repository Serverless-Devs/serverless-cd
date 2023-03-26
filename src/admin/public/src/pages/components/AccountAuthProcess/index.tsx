import React from 'react';
import { Avatar, Icon } from '@alicloud/console-components';
import { C_REPOSITORY } from '@/constants/repository';
import { upperFirst } from 'lodash';


const AccountAuthProcess = ({ type }) => {
  return (
    <div style={{ width: '100%', textAlign: 'center', marginBottom: -12 }}>
      <h1>继续以完成第三方帐号绑定</h1>
      <div className="flex-r" style={{ justifyContent: 'center' }}>
        <Avatar
          src={
            'https://img.alicdn.com/imgextra/i3/O1CN01y2i5Eg1bcB4XM17SG_!!6000000003485-2-tps-320-320.png'
          }
        />
        <Icon type="switch" style={{ margin: '0 20px' }} />
        {C_REPOSITORY[type]?.svg(36)}
      </div>
      <p style={{ margin: '20px 0' }}>您已通过 {upperFirst(type)} 授权，完善以下登录信息即可完成绑定</p>
    </div>
  );
};


export default AccountAuthProcess;