import React, { FC } from 'react';
import { useRequest } from 'ice';
import SlidePanel from '@alicloud/console-components-slide-panel';
import { Form, Field, Input } from '@alicloud/console-components';
import { FORM_ITEM_LAYOUT } from '@/constants';
import { Toast } from '@/components/ToastContainer';
import { transferOrg } from '@/services/org';

const FormItem = Form.Item;

type IProps = {
  callback: () => Promise<any>;
  dataSource: { name: string };
};

const TransferOrg: FC<IProps> = (props) => {
  const { children, callback, dataSource } = props;
  const { request, loading } = useRequest(transferOrg);
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
      const { success } = await request({ ...values, orgName: dataSource.name });
      if (success) {
        Toast.success('转让组织成功');
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
        title={'转让组织'}
        width="large"
        isShowing={visible}
        onClose={handleClose}
        onOk={handleOK}
        onCancel={handleClose}
        isProcessing={loading}
      >
        <Form field={field} {...FORM_ITEM_LAYOUT}>
          <FormItem label="组织名称" required>
            <Input
              {...init('transferUserName', {
                rules: [
                  {
                    required: true,
                    message: '请输入组织名称',
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

export default TransferOrg;
