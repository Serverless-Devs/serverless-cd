import React, { useEffect, useState, useRef } from "react";
import { useRequest } from "ice";
import { Button } from '@alicloud/console-components'
import PageInfo from '@/components/PageInfo';
import SecretTable from '@/components/SecretTable';
import SecretDrawer from '@/components/SecretDrawer';
import { Toast } from '@/components/ToastContainer';
import { updateApp } from '@/services/applist';
import { isEmpty, map, keys, forEach } from 'lodash';

interface Props {
  secrets: object,
  appId: string,
  refreshCallback: Function,
  provider: string
}

const SecretConfig = ({
  secrets = {},
  appId,
  refreshCallback,
  provider
}: Props) => {
  const [secretList, setSecretList] = useState<any[]>([]);
  const {loading, request} = useRequest(updateApp);
  const secretsDrawerRef: any = useRef();

  useEffect(() => {
    setSecretList(formaSecrets(secrets));
  }, [secrets])

  const formaSecrets = (secrets) => {
    return map(keys(secrets), (key) => {
      return {
        key,
        value: secrets[key],
        showPassword: false
      }
    })
  }

  const showDrawer = () => {
    secretsDrawerRef?.current?.setValue('secrets', secretList);
    secretsDrawerRef?.current?.setVisible(true);
  }

  const onCompileSecret = async() => {
    const secretsData = secretsDrawerRef?.current?.getValue('secrets') || [];
    const secretsParams = {}
    forEach(secretsData, ({ key, value }) => {
      secretsParams[key] = value
    })
    const { success } = await request({ secrets: secretsParams, appId, provider  })
    if (success) {
      Toast.success('配置成功');
      secretsDrawerRef?.current?.closeDrawer();
      refreshCallback && refreshCallback();
    }
  }

  return (
    <PageInfo
      title="密钥配置"
      extra={<Button type="primary" text onClick={showDrawer}>编辑</Button>}
    >
      <SecretTable secretList={secretList} setSecretList={setSecretList} />
      <SecretDrawer
        title='编辑Secret'
        loading={loading}
        ref={secretsDrawerRef}
        onSubmit={onCompileSecret}
      />
    </PageInfo>
  )
}

export default SecretConfig;