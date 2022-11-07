import React, { useEffect, useState, useRef } from 'react';
import { useRequest } from 'ice';
import { Button } from '@alicloud/console-components';
import PageInfo from '@/components/PageInfo';
import PageLayout from '@/layouts/PageLayout';
import { map, get, forEach, keys, isEmpty } from 'lodash';
import { addOrCompileSecrets, gitGlobalSecrets } from '@/services/user';
import { Toast } from '@/components/ToastContainer';
import SecretTable from '@/components/SecretTable';
import SecretDrawer from '@/components/SecretDrawer';

const Secrets = () => {
  const [secretList, setSecretList] = useState<any[]>([]);
  const [isAddSecret, setIsAddSecret] = useState(false);
  const { loading, request } = useRequest(addOrCompileSecrets);
  const globalSecrets = useRequest(gitGlobalSecrets);
  const secrets = get(globalSecrets.data, 'data.secrets', {});
  const secretsDrawerRef: any = useRef();
  useEffect(() => {
    globalSecrets.request()
  }, [])

  useEffect(() => {
    if (!isEmpty(secrets)) {
      setSecretList(formaSecrets(secrets));
    }
  }, [secrets])

  const onAddOrCompileSecret = async () => {
    const secretsData = secretsDrawerRef?.current?.getValue('secrets') || [];
    const secretsParams = {}
    forEach(secretsData, ({ key, value }) => {
      secretsParams[key] = value
    })
    const { success } = await request({ secrets: secretsParams, isAdd: isAddSecret })
    if (success) {
      Toast.success('配置成功');
      secretsDrawerRef?.current?.closeDrawer();
      globalSecrets.request()
    }
  }

  const showDrawer = (triggerType) => {
    setIsAddSecret(triggerType);
    if (!triggerType) secretsDrawerRef?.current?.setValue('secrets', secretList);
    secretsDrawerRef?.current?.setVisible(true);
  }

  const formaSecrets = (secrets) => {
    return map(keys(secrets), (key) => {
      return {
        key,
        value: secrets[key],
        showPassword: false
      }
    })
  }

  return (
    <PageLayout
      title="Secrets"
      breadcrumbExtra={<Button type="primary" onClick={() => showDrawer(true)}>新增Secret</Button>}
      breadcrumbs={[
        {
          name: '设置',
        },
        {
          name: 'Secrets',
        },
      ]}
    >
      <PageInfo
        title="密钥配置"
        extra={<Button type="primary" text onClick={() => showDrawer(false)}>编辑</Button>}
      >
        <SecretTable
          secretList={secretList}
          loading={globalSecrets.loading}
          setSecretList={setSecretList} />
      </PageInfo>
      <SecretDrawer
        title={isAddSecret ? '新增Secret' : '编辑Secret'}
        loading={loading}
        ref={secretsDrawerRef}
        onSubmit={onAddOrCompileSecret}
      />
    </PageLayout>
  );
}

export default Secrets