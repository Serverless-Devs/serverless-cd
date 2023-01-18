import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Select, Button, Dialog, Input, Field, Message } from '@alicloud/console-components';
import store from '@/store';
import { get, noop, find } from 'lodash';
import { updateUserInfo } from '@/services/user';
import { useRequest } from 'ice';
import { FORM_ITEM_LAYOUT } from '@/constants';
import { Toast } from '@/components/ToastContainer';
import RefreshIcon from '@/components/RefreshIcon';

const FormItem = Form.Item;

interface IUserInfo {
  avatar: string;
  id: string;
  isAuth: boolean;
  username: string;
  label: string | ReactNode;
  value: string;
  github_name: string;
}

interface IProps {
  value?: IUserInfo | undefined;
  onChange?: (value: IUserInfo) => void;
  reset?: () => void;
}

const AuthDialog = (props: IProps) => {
  const { value, onChange = noop, reset = noop } = props;
  const [visible, setVisible] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const { loading, request } = useRequest(updateUserInfo);
  const [userState, userDispatchers] = store.useModel('user');
  const effectsState = store.useModelEffectsState('user');

  const field = Field.useField();
  const { init, validate, setValue, getValue } = field;

  useEffect(() => {
    if (!userState.isAuth) {
      // 重置上层数据
      reset();
      // 重置当前组件的数据
      field.reset();
    }
    fetchUserList();
  }, [userState.isAuth]);

  const fetchUserList = async () => {
    if (!userState.isAuth) {
      setValue('user_list', []);
      return;
    }
    const userInfo = userState.userInfo as IUserInfo;
    const data: IUserInfo[] = [];
    data.push({
      ...userInfo,
      label: (
        <div className="flex-r">
          <div className="align-center">
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                className="ml-4 mr-4"
                style={{ borderRadius: '50%', height: 20 }}
              />
            ) : (
              <span className="avatar-default-img">
                {get(userInfo, 'username', '').slice(0, 1)}
              </span>
            )}
            <span>{userInfo.github_name || userInfo.username}</span>
          </div>
          <Button className="unbind" type="primary" text onClick={onUnbind}>
            解绑
          </Button>
        </div>
      ),
      value: userInfo.github_name || userInfo.username,
    });
    setValue('user_list', data);
    onChange(userInfo);
  };

  const valueRender = ({ value }) => {
    const item = find(getValue('user_list'), (item: IUserInfo) => item.value === value);
    if (!item) return null;
    return (
      <div className="align-center">
        {item.avatar ? (
          <img
            className="mr-4"
            src={item.avatar}
            style={{ width: 20, height: 20, borderRadius: '50%' }}
          />
        ) : (
          <span className="avatar-default-img">{get(item, 'username', '').slice(0, 1)}</span>
        )}
        <span>{item.github_name || item.username}</span>
      </div>
    );
  };

  const onUnbind = (e) => {
    e.stopPropagation();
    Dialog.confirm({
      title: '您确定解除Github的账户授权吗',
      content: '若您解除绑定，当前账户下的所有应用将无法触发部署流程。',
      onOk: async () => {
        try {
          await request({ token: '', provider: 'github' });
          // 重置上层数据
          reset();
          // 重置当前组件的数据
          field.reset();
          userDispatchers.getUserInfo();
        } catch (error) {
          Toast.error(error.message);
        }
      },
    });
  };

  const authAccount = () => {
    validate(async (errors, values) => {
      if (errors) return;
      const token = get(values, 'token', '');
      try {
        await request({ token, provider: 'github' });
      } catch (error) {
        Toast.error(error.message);
      }
      userDispatchers.getUserInfo();
      setVisible(false);
    });
  };

  const handleChange = (value: string) => {
    const item = find(getValue('user_list'), (item: IUserInfo) => item.value === value);
    onChange(item);
  };

  const refresh = async () => {
    setRefreshLoading(true);
    await userDispatchers.getUserInfo();
    setRefreshLoading(false);
  };

  return (
    <>
      <div className="flex-r position-r">
        <Select
          className="full-width"
          placeholder="请选择"
          dataSource={getValue('user_list')}
          state={effectsState.getUserInfo.isLoading ? 'loading' : undefined}
          disabled={effectsState.getUserInfo.isLoading}
          value={value?.github_name || value?.username}
          onChange={handleChange}
          valueRender={valueRender}
          popupClassName="icon-right"
        />
        <RefreshIcon
          style={{ position: 'absolute', right: -20 }}
          refreshCallback={refresh}
          loading={refreshLoading}
        />
      </div>
      {!userState.isAuth && (
        <div className="align-center mt-4 fz-12">
          <span>您还未授权Serverless cd读取您的代码仓库.</span>
          <Button
            className="ml-8"
            type="primary"
            size="small"
            text
            onClick={() => setVisible(true)}
          >
            授权账户
          </Button>
        </div>
      )}

      <Dialog
        size="small"
        title="授权账户"
        visible={visible}
        onOk={authAccount}
        okProps={{
          loading,
        }}
        onCancel={() => setVisible(false)}
        onClose={() => setVisible(false)}
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
    </>
  );
};

export default AuthDialog;
