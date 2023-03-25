import React, { useImperativeHandle } from 'react';
import { useRequest } from 'ice';
import { Form, Field, Input } from '@alicloud/console-components';
import { updateInfo } from '@/services/auth';

interface IModifyPassword {
  onRef: any;
  value: any;
}
const FormItem = Form.Item;
const ModifyPassword = ({ value, onRef }: IModifyPassword) => {
  const field = Field.useField();
  const { init, validate, getValue } = field;
  const UpdateInfo = useRequest(updateInfo);

  useImperativeHandle(onRef, () => ({
    handleSubmitModifyPassword,
  }));
  const handleSubmitModifyPassword = async () => {
    validate(async (err, values) => {
      if (err)  return err;
      return await UpdateInfo.request({ ...values, username: value.username });
      
    })
  }

  const validatePassword = (rule, value, tag) => {
    const regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,18}');
    const password = getValue('new_password');
    const confirm_password = getValue('confirm_password');
    if (tag === 'confirm_password') {
      return new Promise((resolve, reject) => {
        if (password === confirm_password) {
          resolve(value);
        } else {
          reject([new Error('确认密码与新密码不一致')]);
        }
      });
    }
    return new Promise((resolve, reject) => {
      if (regex.test(value)) {
        resolve(value);
      } else {
        reject([new Error('密码中必须包含字母、数字、特称字符，至少6个字符，最多18个字符')]);
      }
    });
  };

  return (
    <Form
      field={field}
      style={{ width: '540px' }}
    >
      <FormItem
        label="当前密码"
      >
        <Input
          {...init('password', {
          })}
          placeholder="密码中必须包含字母、数字、特称字符，至少6个字符，最多18个字符"
        />
      </FormItem>
      <FormItem
        label="新密码"
      >
        <Input
          {...init('new_password', {
            rules: [
              {
                validator: validatePassword,
              },
            ],
          })}
          placeholder="新密码和当前密码不能相同"
        />
      </FormItem>
      <FormItem
        label="确认密码"
      >
        <Input
          {...init('confirm_password', {
            rules: [
              {
                validator: (rule, value) => validatePassword(rule, value, 'confirm_password'),
              },
            ],
          })}
          placeholder="确认密码和新密码保持一致"
        />
      </FormItem>
      <button onClick={handleSubmitModifyPassword}>asd</button>
    </Form>
    );
};


export default ModifyPassword;