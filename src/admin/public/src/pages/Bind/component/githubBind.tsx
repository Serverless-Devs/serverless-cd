import React, { FC, useState, useEffect } from 'react';
import { useRequest } from 'ice';
import { updateUserProviderToken } from '@/services/user';
import { Dialog, Form, Message, Input, Field } from '@alicloud/console-components';
import { FORM_ITEM_LAYOUT } from '@/constants';
import { get } from 'lodash';

const FormItem = Form.Item;
type Props = {
  active: boolean;
  callback: () => Promise<any>;
  handleChangeRefresh: () => void;
};
const GitHubBind: FC<Props> = (props) => {
  const { active, callback, handleChangeRefresh } = props;
  const { loading, request } = useRequest(updateUserProviderToken);
  const [visible, setVisible] = useState(false);
  const field = Field.useField();
  const { init, validate, setValue, getValue } = field;

  useEffect(() => {
    setVisible(active);
  }, [active]);

  const authAccount = () => {
    validate(async (errors, values) => {
      if (errors) return;
      const token = get(values, 'token', '');
      const { success } = await request({ token, provider: 'github' });
      if (!success) return;
      setVisible(false);
      callback();
      handleChangeRefresh();
    });
  };

  const onClose = () => {
    setVisible(false);
    callback();
  };

  return (
    <Dialog
      size="small"
      title="授权账户"
      visible={visible}
      onOk={authAccount}
      okProps={{
        loading,
      }}
      onCancel={onClose}
      onClose={onClose}
    >
      <Message type="notice" className="mb-20">
        您需要将授权的token绑定到Serverless cd才能访问您的代码仓库，
        <a href="https://github.com/settings/tokens" target="_black">
          立即授权
        </a>
      </Message>
      <Form style={{ width: '100%' }} {...FORM_ITEM_LAYOUT} field={field}>
        <FormItem name="token" label="私有 token" required>
          <Input
            {...init('token', {
              rules: [
                {
                  required: true,
                  message: '请输入私有 token',
                },
              ],
            })}
          />
          <span></span>
        </FormItem>
      </Form>
    </Dialog>
  );
};

export default GitHubBind;
