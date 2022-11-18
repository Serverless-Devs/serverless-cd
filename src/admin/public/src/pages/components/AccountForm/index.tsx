import React from 'react';
import { Input, Icon, Form } from '@alicloud/console-components';
const FormItem = Form.Item;

const AccountForm = (props: any) => {
  const { init, getError } = props;
  const checkPass = (rule, value) => {
    const regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,18}');
    return new Promise((resolve, reject) => {
      if (regex.test(value)) {
        resolve(value);
      } else {
        reject([new Error('密码中必须包含字母、数字、特称字符，至少6个字符，最多18个字符')]);
      }
    });
  };

  const checkUsername = (rule, value) => {
    const regex = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g;
    return new Promise((resolve, reject) => {
      if (regex.test(value)) {
        reject([new Error('请输入正确格式，不支持中文')]);
      } else if (/\s/g.test(value)) {
        reject([new Error('请输入正确格式，不支持空格')]);
      } else {
        resolve(value);
      }
    });
  };

  return (
    <>
      <Form
        style={{ width: 320, margin: 'auto' }}
        labelTextAlign="left"
        size="large"
        labelAlign="inset"
      >
        <FormItem>
          <Input
            {...init('username', {
              rules: [
                {
                  validator: checkUsername,
                },
              ],
            })}
            innerBefore={<Icon type="account" style={{ margin: 4 }} />}
            placeholder="账号名称"
          />
          {getError('username') ? (
            <span className="form-error">{getError('username').join(',')}</span>
          ) : (
            ''
          )}
        </FormItem>
        <FormItem>
          <Input.Password
            {...init('password', {
              rules: [
                {
                  validator: checkPass,
                },
              ],
            })}
            innerBefore={<Icon type="lock" style={{ margin: 4 }} />}
            placeholder="账号密码"
          />
          {getError('password') ? (
            <span className="form-error">{getError('password').join(',')}</span>
          ) : (
            ''
          )}
        </FormItem>
      </Form>
    </>
  );
};

export default AccountForm;
