import React, { FC } from 'react';
import { useRequest } from 'ice';
import SlidePanel from '@alicloud/console-components-slide-panel';
import { Form, Field, Input } from '@alicloud/console-components';
import { FORM_ITEM_LAYOUT } from '@/constants';
import { Toast } from '@/components/ToastContainer';
import { inviteUser } from '@/services/org';

const FormItem = Form.Item;

type IProps = {
  callback: () => Promise<any>;
};

const AddMember: FC<IProps> = (props) => {
  const { children, callback } = props;
  const { request, loading } = useRequest(inviteUser);
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
      try {
        const { success } = await request(values);
        if (success) {
          Toast.success('添加成员成功');
          setVisible(false);
          resetToDefault();
          await callback();
        }
      } catch (error) {
        Toast.error(error.message);
      }
    });
  };

  return (
    <>
      <span onClick={() => setVisible(true)}>{children}</span>
      <SlidePanel
        title={'添加成员'}
        width="large"
        isShowing={visible}
        onClose={handleClose}
        onOk={handleOK}
        onCancel={handleClose}
        isProcessing={loading}
      >
        <Form field={field} {...FORM_ITEM_LAYOUT}>
          <FormItem label="用户ID" required>
            <Input
              {...init('userId', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户ID',
                  },
                ],
              })}
            />
          </FormItem>
        </Form>
      </SlidePanel>
    </>
  );
};

export default AddMember;
