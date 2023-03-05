import React from 'react';
import { Field } from '@alicloud/console-components';
import PageLayout from '@/layouts/PageLayout';
import CreateType, { CREATE_TYPE } from './components/CreateType';
import Github from './components/github/index';
import Submit from './components/Submit';
import Application from './components/application';
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
  const { init, getValue, setValue } = field;

  const changeTab = () => {
    setValue('createType',CREATE_TYPE.Repository)
  }

  return (
    <div className="appliaction-create-container">
      <CreateType {...init('createType', { initValue: CREATE_TYPE.Repository })} />
      {getValue('createType') === CREATE_TYPE.Repository && <Github field={field} />}
      {getValue('createType') === CREATE_TYPE.Template && <h1>敬请期待...</h1>}
      {getValue('createType') === CREATE_TYPE.Repository && (
        <Submit field={field} orgName={orgName} />
      )}
    </div>
  );
};

export default Create;
