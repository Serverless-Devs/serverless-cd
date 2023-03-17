import React, { FC } from 'react';
import { useRequest } from 'ice';
import SlidePanel from '@alicloud/console-components-slide-panel';
import { Form, Field, Input } from '@alicloud/console-components';
import { FORM_ITEM_LAYOUT } from '@/constants';
import { Toast } from '@/components/ToastContainer';
import { createOrg } from '@/services/org';

const FormItem = Form.Item;

type IProps = {
  callback: () => Promise<any>;
};

const CreateOrg: FC<IProps> = (props) => {
  const { children, callback } = props;
  const { request, loading } = useRequest(createOrg);
  const [visible, setVisible] = React.useState(false);
  const field = Field.useField();
  const { init, resetToDefault, validate } = field;
  const handleClose = () => {
    resetToDefault();
    setVisible(false);
  };
  const handleOK = async () => {
    validate(async (errors, values) => {
      if (errors) return;
      const { success } = await request(values);
      if (success) {
        Toast.success('创建团队成功');
        setVisible(false);
        resetToDefault();
        await callback();
      }
    });
  };

  return (
    <>
      <span onClick={() => setVisible(true)}>{children}</span>
      <SlidePanel
        title={'新建团队'}
        width="large"
        isShowing={visible}
        onClose={handleClose}
        onOk={handleOK}
        onCancel={handleClose}
        isProcessing={loading}
      >
        <Form field={field} {...FORM_ITEM_LAYOUT}>
          <FormItem label="团队名称" required>
            <Input
              {...init('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入团队名称',
                  },
                ],
              })}
            />
          </FormItem>
          <FormItem label="描述">
            <Input {...init('description')} />
          </FormItem>
        </Form>
      </SlidePanel>
    </>
  );
};

export default CreateOrg;
