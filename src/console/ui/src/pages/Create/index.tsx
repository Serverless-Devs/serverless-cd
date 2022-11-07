import React from 'react';
import { Field } from '@alicloud/console-components';
import PageLayout from '@/layouts/PageLayout';
import CreateType, { CREATE_TYPE } from './components/CreateType';
import Github from './components/github/index';
import Submit from './components/Submit';
import './index.less';

const Create = () => {
  return (
    <PageLayout
      breadcrumbs={[
        {
          name: '应用列表',
          path: '/',
        },
        {
          name: '创建应用',
        },
      ]}
    >
      <CreateAppLication />
    </PageLayout>
  );
};

export const CreateAppLication = () => {
  const field = Field.useField();
  const { init, getValue } = field;

  return (
    <div className="appliaction-create-container">
      <CreateType {...init('createType', { initValue: CREATE_TYPE.Repository })} />
      {getValue('createType') === CREATE_TYPE.Repository && <Github field={field} />}
      {getValue('createType') === CREATE_TYPE.Template && <h1>敬请期待...</h1>}
      {getValue('createType') === CREATE_TYPE.Repository && <Submit field={field} />}
    </div>
  );
};

export default Create;
