import React, { useEffect, FC } from 'react';
import { useRequest } from 'ice';
import CredentialUi from '@serverless-cd/credential-ui';
import { Button } from '@alicloud/console-components';
import { orgDetail, orgUpdate } from '@/services/org';
import CloudTable from '@/components/CloudTable';
import { get, keys, set, unset } from 'lodash';
import PageInfo from '@/components/PageInfo';
import RefreshButton from '@/components/RefreshButton';

const Cloud: FC<{}> = (props) => {
  const orgName = get(props, 'match.params.orgName', '');
  const orgRequestDetail = useRequest(orgDetail);
  const cloudSecret = get(orgRequestDetail, 'data.data.cloud_secret') || {};
  const existAlias = keys(cloudSecret) || [];

  useEffect(() => {
    orgRequestDetail.request();
  }, [orgName]);

  const onConfirm = async (data: Record<string, any>) => {
    const { alias } = data;
    unset(data, 'alias');
    set(cloudSecret, alias, data);
    await orgUpdate({ cloud_secret: cloudSecret });
    await orgRequestDetail.refresh();
  }

  return (
    <PageInfo
      extra={
        <CredentialUi
          showAccountID
          existAlias={existAlias}
          onConfirm={onConfirm}
        >
          <Button type="primary">添加账号</Button>
        </CredentialUi>
      }
      endExtra={<RefreshButton refreshCallback={orgRequestDetail.refresh} />}
    >
      <CloudTable
        refresh={orgRequestDetail.refresh}
        data={cloudSecret}
        loading={orgRequestDetail.loading}
      />
    </PageInfo>
  );
}

export default Cloud;