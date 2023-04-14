import React, { FC, useEffect } from 'react';
import { useRequest, useLocation, history } from 'ice';
import { Form, Field, Select, Dialog, Loading } from '@alicloud/console-components';
import { FORM_ITEM_LAYOUT, ROLE, ROLE_LABEL } from '@/constants';
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
  active?: boolean;
  orgName?: string;
  changeVisible?: any;
};

const AddMember: FC<IProps> = (props) => {
  const { pathname } = useLocation();
  const {
    children,
    callback,
    type = 'create',
    dataSource,
    existUsers,
    active = false,
    orgName,
    changeVisible,
  } = props;
  if (getParam('showSlide') === 'true' && type !== 'create') return null;
  const { request, loading } = useRequest(type === 'create' ? inviteUser : updateAuth);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (active) {
      setVisible(active);
    }
  }, [active]);

  const field = Field.useField();
  const { init, resetToDefault, validate, getValue, setValue, setValues } = field;
  const handleClose = () => {
    resetToDefault();
    setVisible(false);
    changeVisible && changeVisible(false);
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
        active && history?.push(`/${orgName}/setting/members?orgRefresh=${new Date().getTime()}`);
        await callback();
        handleClose();
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

  const initValue = () => {
    setValues(dataSource);
  };

  return (
    <>
      <span
        onClick={() => {
          initValue();
          setVisible(true);
        }}
      >
        {children}
      </span>
      <Dialog
        title={type === 'create' ? '添加成员' : '编辑成员'}
        visible={visible}
        onClose={handleClose}
        onOk={handleOK}
        onCancel={handleClose}
      >
        <Loading visible={loading}>
          <Form field={field} {...FORM_ITEM_LAYOUT} className="add-member">
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
                dataSource={Object.values(ROLE).map((value) => ({
                  value,
                  label: ROLE_LABEL[value],
                }))}
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
        </Loading>
      </Dialog>
    </>
  );
};

export default AddMember;
