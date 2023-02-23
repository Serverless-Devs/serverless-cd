import React, { FC } from 'react';
import { useRequest } from 'ice';
import SlidePanel from '@alicloud/console-components-slide-panel';
import { Form, Field, Input, Select } from '@alicloud/console-components';
import { FORM_ITEM_LAYOUT, ROLE } from '@/constants';
import { Toast } from '@/components/ToastContainer';
import { inviteUser, updateAuth } from '@/services/org';

const FormItem = Form.Item;

type IProps = {
  title?: string;
  type?: 'create' | 'edit';
  callback: () => Promise<any>;
  dataSource?: { inviteUserName: string; role: `${ROLE}` };
};

const AddMember: FC<IProps> = (props) => {
  const { children, callback, type = 'create', dataSource } = props;
  const { request, loading } = useRequest(type === 'create' ? inviteUser : updateAuth);
  const [visible, setVisible] = React.useState(false);
  const field = Field.useField({
    values: dataSource,
  });
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
        Toast.success(type === 'create' ? '添加成员成功' : '编辑成员成功');
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
        title={type === 'create' ? '添加成员' : '编辑成员'}
        width="large"
        isShowing={visible}
        onClose={handleClose}
        onOk={handleOK}
        onCancel={handleClose}
        isProcessing={loading}
      >
        <Form field={field} {...FORM_ITEM_LAYOUT}>
          <FormItem label="用户名称" required>
            <Input
              disabled={type === 'edit'}
              {...init('inviteUserName', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名称',
                  },
                ],
              })}
            />
          </FormItem>
          <FormItem label="角色" required>
            <Select
              className="full-width"
              dataSource={[
                {
                  label: '管理员',
                  value: ROLE.ADMIN,
                },
                {
                  label: '开发者',
                  value: ROLE.MEMBER,
                },
              ]}
              {...init('role', {
                rules: [
                  {
                    required: true,
                    message: '请选择角色',
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
