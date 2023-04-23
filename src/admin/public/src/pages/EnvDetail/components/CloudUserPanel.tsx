import React, { useState, useEffect } from 'react';
import { useRequest, Link } from 'ice';
import { Field, Button, Dialog, Message, Form, Select } from '@alicloud/console-components';
import { orgDetail, updateCloudSecret } from '@/services/org';
import { updateApp } from '@/services/applist';
import CredentialUi from '@serverless-cd/credential-ui';
import { keys, get, map, isEmpty, unset, noop } from 'lodash';
import { FORM_ITEM_LAYOUT } from '@/constants';
import '@/styles/secrets.less';

interface Props {
  detailData: object;
  link?: string;
  currentCloud?: string;
  envName: string;
  refreshCallback: Function
}

const CloudUserPanel = ({ detailData, link = '/', currentCloud, envName = '', refreshCallback = noop }: Props) => {
  const [visible, setVisible] = useState(false);
  const orgRequestDetail = useRequest(orgDetail);
  const updateRequestApp = useRequest(updateApp);

  const cloudSecret = get(orgRequestDetail.data, 'data.cloud_secret') || {};
  const field = Field.useField();
  const { init, getValue } = field;

  useEffect(() => {
    orgRequestDetail.request()
  }, [])

  const onConfirm = async (data: Record<string, any>) => {
    const { alias } = data;
    unset(data, 'alias');
    await updateCloudSecret({ [alias]: data });
    await editCloudSecret(alias);
    await orgRequestDetail.refresh();
  };

  const editCloudSecret = async (cloudAlias) => {
    const environment = get(detailData, 'environment') as any;
    const appId = get(detailData, 'id');
    environment[envName].cloud_alias = cloudAlias;
    const { success } = await updateRequestApp.request({ environment, appId });
    success && await refreshCallback();
  }

  return (
    <>
      {
        (!currentCloud && isEmpty(cloudSecret)) ? (
          <CredentialUi title="添加账号" showAccountID onConfirm={onConfirm}>
            <Button type="primary" className='ml-8' text>新增并绑定云账号</Button>
          </CredentialUi>
        ) : (
          <Button type="primary" text className='ml-8' onClick={() => setVisible(true)}>{currentCloud ? '切换账号' : '绑定账号'}</Button>
        )
      }
      <Dialog
        size="small"
        title="关联云账号"
        visible={visible}
        onOk={async () => {
          await editCloudSecret(getValue('cloud_alias'));
          setVisible(false);
        }}
        okProps={{
          loading: updateRequestApp.loading,
        }}
        onCancel={() => setVisible(false)}
        onClose={() => setVisible(false)}
      >
        <Message type="notice" className="mb-20">
          如需管理更多云账号，请往前
          <Link
            className="commit-description"
            to={link}
          >
            云账号管理
          </Link>
          页面进行配置
        </Message>
        <Form style={{ width: '100%' }} {...FORM_ITEM_LAYOUT} field={field}>
          <Form.Item name="token" label="关联云账号" required>
            <Select
              {...(init('cloud_alias', { initValue: currentCloud }) as any)}
              className="full-width"
              placeholder="请选择"
              dataSource={map(keys(cloudSecret), (item) => ({ label: item, value: item, disabled: currentCloud === item }))}
            />
          </Form.Item>
        </Form>
      </Dialog>
    </>
  );
};

export default CloudUserPanel
