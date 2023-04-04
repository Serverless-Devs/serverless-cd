import React, { FC, useState, useEffect } from 'react';
import { useRequest, history } from 'ice';
import SlidePanel from '@alicloud/console-components-slide-panel';
import PageLayout from '@/layouts/PageLayout';
import { FORM_ITEM_LAYOUT } from '@/constants';
import { Toast } from '@/components/ToastContainer';
import { createOrg } from '@/services/org';
import { Form, Field, Input, Button, Dialog } from '@alicloud/console-components';

const FormItem = Form.Item;

type Props = {
  active?: boolean;
  callback?: any;
  changeVisible?: any;
};

const CreateOrg: FC<Props> = (props) => {
  const { active, callback, changeVisible } = props;
  const { request, loading } = useRequest(createOrg);
  const field = Field.useField();
  const { init, validate } = field;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    active && setVisible(active);
  }, [active]);

  const onSubmit = async () => {
    validate(async (errors, values) => {
      if (errors) return;
      const { success } = await request(values);
      if (success) {
        Toast.success('创建团队成功');
        setVisible(false);
        callback();
        history?.push(`/organizations?orgRefresh=${new Date().getTime()}`)
      }
    });
  };
  const handleClose = () => {
    setVisible(false);
    changeVisible(false);
  };
  return (
    <Dialog
      title={'新建团队'}
      visible={visible}
      onClose={handleClose}
      onOk={onSubmit}
      onCancel={handleClose}
    >
      <Form field={field} {...FORM_ITEM_LAYOUT} className="add-org">
        <FormItem label="团队地址" required>
          <Input
            {...init('name', {
              rules: [
                {
                  required: true,
                  message: '请输入团队地址',
                },
              ],
            })}
          />
        </FormItem>
        <FormItem label="团队名称" required>
          <Input
            {...init('alias', {
              rules: [
                {
                  required: true,
                  message: '请输入团队名称',
                },
              ],
            })}
          />
        </FormItem>
        <FormItem label="Logo">
          <Input {...init('logo')} />
        </FormItem>
        <FormItem label="描述">
          <Input {...init('description')} />
        </FormItem>
      </Form>
    </Dialog>
  );
};

export default CreateOrg;
