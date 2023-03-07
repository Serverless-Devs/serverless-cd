import React, { useState, useRef, useEffect } from 'react';
import { Field } from '@alicloud/console-components';
import PageLayout from '@/layouts/PageLayout';
import CreateType, { CREATE_TYPE } from './components/CreateType';
import Github from './components/github/index';
import CreateTemplate from './components/template/index';
import { setSearchParams, getParam } from '@/utils/index';
import './index.less';

const Create = ({
  match: {
    params: { orgName },
  },
}) => {
  return (
    <PageLayout
      breadcrumbs={[
        {
          name: '应用列表',
          path: `/${orgName}/application`,
        },
        {
          name: '创建应用',
        },
      ]}
    >
      <CreateAppLication orgName={orgName} />
    </PageLayout>
  );
};

export const CreateAppLication = ({ orgName }) => {
  const field = Field.useField();
  const template = getParam('template');
  const [createType, setCreateType] = useState(
    template ? CREATE_TYPE.Template : CREATE_TYPE.Repository,
  );
  const [pageKey, forceUpdate] = useState(0);
  const templateRef: any = useRef(null);
  const onChangeCreateType = (type) => {
    setSearchParams({ template: '' });
    setCreateType(type);
  };

  return (
    <div className="appliaction-create-container">
      {!template && <CreateType value={createType} onChange={onChangeCreateType} />}
      {createType === CREATE_TYPE.Template && (
        <CreateTemplate
          key={pageKey}
          forceUpdate={() => forceUpdate(pageKey + 1)}
          field={field}
          ref={templateRef}
          orgName={orgName}
        />
      )}
      {createType === CREATE_TYPE.Repository && (
        <Github field={field} createType={CREATE_TYPE.Repository} orgName={orgName} />
      )}
    </div>
  );
};

export default Create;
