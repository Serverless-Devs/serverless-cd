import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import TemplateContent from './TemplateContent';
import TemplateList from './TemplateList';
import { getParam } from '@/utils';
import { noop } from 'lodash';

const CreateTemplate = ({ field, forceUpdate = noop, orgName }, ref) => {
  const [template, setTemplate] = useState();

  useImperativeHandle(ref, () => ({
    template,
  }));

  useEffect(() => {
    const template: any = getParam('template');
    setTemplate(template);
  }, []);

  return (
    <>
      {template ? (
        <TemplateContent
          field={field}
          template={template}
          forceUpdate={forceUpdate}
          orgName={orgName}
        />
      ) : (
        <TemplateList forceUpdate={forceUpdate} />
      )}
    </>
  );
};

export default forwardRef(CreateTemplate);
