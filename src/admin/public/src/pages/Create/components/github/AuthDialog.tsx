import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Select, Button, Dialog, Input, Field, Message } from '@alicloud/console-components';
import store from '@/store';
import { get, noop, find } from 'lodash';
import { updateUserProviderToken } from '@/services/user';
import { orgDetail } from '@/services/org';
import { useRequest } from 'ice';
import { FORM_ITEM_LAYOUT } from '@/constants';
import RefreshIcon from '@/components/RefreshIcon';

const FormItem = Form.Item;

interface IUserInfo {
  avatar: string;
  id: string;
  username: string;
  label: string | ReactNode;
  value: string;
  third_part: {
    github: {
      repo_owner: string;
      avatar: string;
      id: number;
    };
  };
}

interface IProps {
  value?: IUserInfo | undefined;
  onChange?: (value: IUserInfo) => void;
  reset?: () => void;
  setRepoKey?: (key: number) => void;
  repoKey?: number;
}

const AuthDialog = (props: IProps) => {
  const { value, onChange = noop, reset = noop, setRepoKey, repoKey = 0 } = props;
  const [visible, setVisible] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const { loading, request } = useRequest(updateUserProviderToken);
  const orgDetailRequest = useRequest(orgDetail);
  const [userState] = store.useModel('user');
  const field = Field.useField();
  const { init, validate, setValue, getValue } = field;
  const isAuth = Boolean(get(orgDetailRequest.data, 'data.third_part.github.repo_owner'));
  const isOwner = get(orgDetailRequest.data, 'data.user_id') === get(userState, 'userInfo.id');
  useEffect(() => {
    orgDetailRequest.request();
  }, []);

  useEffect(() => {
    if (!isAuth) {
      // 重置上层数据
      reset();
      // 重置当前组件的数据
      field.reset();
    }
    fetchUserList();
  }, [isAuth]);

  const fetchUserList = async () => {
    if (!isAuth) {
      setValue('user_list', []);
      return;
    }
    const userInfo = get(orgDetailRequest.data, 'data', {}) as IUserInfo;
    const avatar = get(userInfo, 'third_part.github.avatar', '');
    const value = get(userInfo, 'third_part.github.repo_owner', '');
    userInfo.value = value;
    userInfo.label = (
      <div className="flex-r">
        <div className="align-center">
          {avatar ? (
            <img src={avatar} className="ml-4 mr-4" style={{ borderRadius: '50%', height: 20 }} />
          ) : (
            <span className="avatar-default-img">{value.slice(0, 1)}</span>
          )}
          <span>{value}</span>
        </div>
        <Button className="unbind" type="primary" text onClick={onUnbind} disabled={!isOwner}>
          解绑
        </Button>
      </div>
    );
    setValue('user_list', [userInfo]);
    onChange(userInfo);
  };

  const valueRender = ({ value }) => {
    const item = find(getValue('user_list'), (item: IUserInfo) => item.value === value);
    if (!item) return null;
    const avatar = get(item, 'third_part.github.avatar', '');
    return (
      <div className="align-center">
        {avatar ? (
          <img
            className="mr-4"
            src={avatar}
            style={{ width: 20, height: 20, borderRadius: '50%' }}
          />
        ) : (
          <span className="avatar-default-img">{item.value.slice(0, 1)}</span>
        )}
        <span>{item.value}</span>
      </div>
    );
  };

  const onUnbind = (e) => {
    e.stopPropagation();
    Dialog.confirm({
      title: '您确定解除Github的账户授权吗',
      content: '若您解除绑定，当前账户下的所有应用将无法触发部署流程。',
      onOk: async () => {
        await request({ token: '', provider: 'github' });
        // 重置上层数据
        reset();
        // 重置当前组件的数据
        field.reset();
        orgDetailRequest.refresh();
      },
    });
  };

  const authAccount = () => {
    validate(async (errors, values) => {
      if (errors) return;
      const token = get(values, 'token', '');
      const { success } = await request({ token, provider: 'github' });
      if (!success) return;
      refresh();
      setVisible(false);
    });
  };

  const handleChange = (value: string) => {
    const item = find(getValue('user_list'), (item: IUserInfo) => item.value === value);
    onChange(item);
  };

  const refresh = async () => {
    setRefreshLoading(true);
    await orgDetailRequest.refresh();
    setRepoKey && setRepoKey(repoKey + 1);
    setRefreshLoading(false);
  };

  return (
    <>
      <div className="flex-r position-r">
        <Select
          className="full-width"
          placeholder="请选择"
          dataSource={getValue('user_list')}
          state={orgDetailRequest.loading ? 'loading' : undefined}
          disabled={orgDetailRequest.loading}
          value={value?.value}
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
      {!isAuth && (
        <div className="align-center mt-4 fz-12">
          <span>您还未授权Serverless cd读取您的代码仓库.</span>
          <Button
            className="ml-8"
            type="primary"
            size="small"
            text
            onClick={() => setVisible(true)}
            disabled={!isOwner}
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
