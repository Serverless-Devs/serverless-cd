import React, { useEffect, useState, useRef } from 'react';
import { useRequest } from 'ice';
import { Button } from '@alicloud/console-components';
import PageInfo from '@/components/PageInfo';
import { map, get, keys, isEmpty } from 'lodash';
import { orgDetail, orgUpdate } from '@/services/org';
import { Toast } from '@/components/ToastContainer';
import SecretTable from '@/components/SecretTable';
import SecretDrawer from '@/components/SecretDrawer';
import Copy from '@/components/CopyIcon';

const Secrets = () => {
  const [secretList, setSecretList] = useState<any[]>([]);
  const [isAddSecret, setIsAddSecret] = useState(false);
  const { loading, request } = useRequest(orgUpdate);
  const globalSecrets = useRequest(orgDetail);
  const secrets = get(globalSecrets.data, 'data.secrets', {});
  const secretsDrawerRef: any = useRef();
  useEffect(() => {
    globalSecrets.request();
  }, []);

  useEffect(() => {
    if (!isEmpty(secrets)) {
      setSecretList(formaSecrets(secrets));
    }
  }, [secrets]);

  const onAddOrCompileSecret = async (values) => {
    const { success } = await request({ secrets: values });
    if (success) {
      Toast.success('配置成功');
      secretsDrawerRef?.current?.closeDrawer();
      globalSecrets.request();
    }
  };

  const showDrawer = (triggerType) => {
    setIsAddSecret(triggerType);
    secretsDrawerRef?.current?.setVisible(true);
  };

  const formaSecrets = (secrets) => {

    return map(keys(secrets), (key) => {
      return {
        key,
        value: secrets[key],
        showPassword: false,
      };
    });
  };

  return (
    <div className='mt-16'>
      <PageInfo
        extra={
          <Button type="primary" onClick={() => showDrawer(false)}>
            编辑
          </Button>
        }
        endExtra={<Copy content={JSON.stringify(secrets)} type="button" text="复制全部密钥" />}
      >
        <SecretTable
          secretList={secretList}
          loading={globalSecrets.loading}
          setSecretList={setSecretList}
        />
      </PageInfo>
      <SecretDrawer
        title={isAddSecret ? '新增Secrets' : '编辑Secrets'}
        loading={loading}
        ref={secretsDrawerRef}
        onSubmit={onAddOrCompileSecret}
        secretsData={isAddSecret ? {} : secrets}
      />
    </div>
  );
};

export default Secrets;
