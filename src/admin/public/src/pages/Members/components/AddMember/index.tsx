import React, { FC, useEffect } from 'react';
import { useRequest, useLocation, history } from 'ice';
import SlidePanel from '@alicloud/console-components-slide-panel';
import { Form, Field, Select } from '@alicloud/console-components';
import { FORM_ITEM_LAYOUT, ROLE } from '@/constants';
import { Toast } from '@/components/ToastContainer';
import { inviteUser, updateAuth } from '@/services/org';
import { debounce, map, filter, includes } from 'lodash';
import { getContainsName } from '@/services/user';
import { getParam } from '@/utils';

const FormItem = Form.Item;

type IProps = {
  title?: string;
  type?: 'create' | 'edit';
  callback: () => Promise<any>;
  dataSource?: { inviteUserName: string; role: `${ROLE}` };
  existUsers?: string[];
};

const AddMember: FC<IProps> = (props) => {
  const { pathname } = useLocation();
  const { children, callback, type = 'create', dataSource, existUsers } = props;
  if (getParam('showSlide') === 'true' && type !== 'create') return null;
  const { request, loading } = useRequest(type === 'create' ? inviteUser : updateAuth);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (getParam('showSlide') === 'true') {
      setVisible(true);
    }
  }, [getParam('showSlide')]);
  const field = Field.useField({
    values: dataSource,
  });
  const { init, resetToDefault, validate, getValue, setValue } = field;
  const handleClose = () => {
    resetToDefault();
    setVisible(false);
    if (getParam('showSlide') === 'true') {
      history?.push(pathname);
    }
  };
  const handleOK = async () => {
    validate(async (errors, values) => {
      if (errors) return;
      const { success } = await request(values);
      if (success) {
        Toast.success(type === 'create' ? '添加成员成功' : '编辑成员成功');
        handleClose();
        await callback();
      }
    });
  };

  const onChangeUserName = async (value) => {
    const data = await getContainsName({ containsName: value });
    const filterUsers = filter(data, (item) => !includes(existUsers, item.username));
    setValue(
      'users',
      map(filterUsers, (item) => ({ label: item.username, value: item.username })),
    );
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
            <Select
              disabled={type === 'edit'}
              showSearch
              hasClear
              placeholder="请输入用户名称（模糊搜索）"
              filterLocal={false}
              className="full-width"
              {...init('inviteUserName', {
                rules: [
                  {
                    required: true,
                    message: '用户名称不能为空',
                  },
                ],
                props: {
                  onSearch: debounce(onChangeUserName, 250, { maxWait: 1000 }),
                },
              })}
              dataSource={getValue('users')}
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
