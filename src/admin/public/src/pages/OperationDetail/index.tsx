import React from 'react';
import { get } from 'lodash';
import Fc from './Fc';
import withEnvDetails from '@/components/WithEnvDetails';

const Details = (props) => {
  const { detailInfo, envName, orgName } = props;
  const data = get(detailInfo, 'data', {});
  const resource = get(data, `environment.${envName}.resource`, {});
  const cloudAlias = get(data, `environment.${envName}.cloud_alias`, '');

  return (<Fc resource={get(resource, 'fc', [])} cloudAlias={cloudAlias} orgName={orgName} />);
};

const OperationDetailPage = withEnvDetails(Details, { pageType: 'operation' })

export default OperationDetailPage;
