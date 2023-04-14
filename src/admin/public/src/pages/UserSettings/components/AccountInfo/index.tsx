import React, { useEffect, createRef, useState } from 'react';
import { history } from 'ice';
import store from '@/store';
import { Form, Field, Input, Button, Dialog, Message } from '@alicloud/console-components';
import ModifyPassword from './component/ModifyPassword';

const FormItem = Form.Item;
const AccountInfo = () => {
  const [, userDispatchers] = store.useModel('user');
  const field = Field.useField();
  const { init, setValues } = field;
  const [account, setAccount] = useState({});
  const mpRef = createRef<any>();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const data = await userDispatchers.getUserInfo();
    setValues(data);
    setAccount(data);
  };

  const handleModifyPassword = () => {
    Dialog.show({
      title: '修改密码',
      content: <ModifyPassword onRef={mpRef} value={account} />,
      onOk: () => {
        const success = mpRef.current.handleSubmitModifyPassword();
        if (success) {
          Message.success({ title: '修改密码成功，请使用新密码登录', duration: 3000 });
          history?.push('/login');
        }
      },
    });
  };
  return (
    <div>
      <Form field={field}>
        <FormItem label={<h3>登录账号</h3>}>
          <Input {...init('username', {})} className={'account-info-public-width'} disabled />
        </FormItem>
        <FormItem label={<h3>登录邮箱</h3>}>
          <Input {...init('email', {})} style={{ width: '240px' }} disabled />
        </FormItem>
        <FormItem label={<h3>登录密码</h3>}>
          <Input
            {...init('password', {
              initValue: '*******',
            })}
            htmlType="password"
            style={{ width: '240px' }}
            disabled
          />
          <Button
            style={{ background: '#e0e0e0', marginLeft: '16px', color: '#40485b' }}
            onClick={handleModifyPassword}
          >
            修改密码
          </Button>
        </FormItem>
      </Form>
      <div></div>
      <div></div>
    </div>
  );
};

export default AccountInfo;
