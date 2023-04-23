import React from 'react';
import BasicInfoDetail from './components/BasicInfoDetail';
import { get } from 'lodash';
import withEnvDetails from '@/components/WithEnvDetails';

const Details = (props) => {
  const { detailInfo, handleRefresh, envName, orgName } = props;
  const data = get(detailInfo, 'data', {});

  return (
    <BasicInfoDetail
      data={data}
      refreshCallback={handleRefresh}
      envName={envName}
      orgName={orgName}
    />
  );
};

const OverviewDetailPage = withEnvDetails(Details, { pageType: 'overview' })

export default OverviewDetailPage;
