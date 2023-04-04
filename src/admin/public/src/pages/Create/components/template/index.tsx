import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import TemplateContent from './TemplateContent';
import { TEMPLATE_TABS, REGISTRY_URL, SERVERLESS_DEVS_LIST_PACKAGE } from '../constant';
import TemplateList from './TemplateList';
import { getParam } from '@/utils';
import { noop, get } from 'lodash';

interface version {
  body?: string;
  created_at?: string;
  name?: string;
  published_at?: string;
  tag_name?: string;
  zipball_url: string;
}
interface templateContent {
  package: string;
  title?: string;
  demo?: string;
  description?: string;
  download?: number;
  logo?: string;
  tabs?: Array<number | string>;
  tags?: Array<string>;
  url?: string;
  user?: number;
  version?: version;
}

const CreateTemplate = ({ field, forceUpdate = noop, orgName }, ref) => {
  const [template, setTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [templateContent, setTemplateContent] = useState<templateContent>({ package: '' });

  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    template,
  }));

  useEffect(() => {
    (async () => {
      const template: any = getParam('template');
      setTemplate(template);
      setLoading(true);
      const response = await fetch(REGISTRY_URL);
      const data = await response.json();
      const templateList_all: templateContent[] = get(data, 'Response');
      let templateDisplayList: templateContent[] = [];
      templateList_all.find((template: templateContent) => {
        if (SERVERLESS_DEVS_LIST_PACKAGE.includes(template.package)) {
          templateDisplayList.push(template);
        }
      });
      let devsTab: any = TEMPLATE_TABS.find((item) => item.key === 'devs');
      TEMPLATE_TABS.splice(TEMPLATE_TABS.indexOf(devsTab), 1, {
        ...devsTab,
        templateList: templateDisplayList,
      });
      setLoading(false);

      //如果为模板详情页，则需获取模板内容
      if (template) {
        const templateContent: templateContent = (await templateDisplayList.find(
          (item: templateContent) => item.package === template,
        )) || { package: '' };
        setTemplateContent(templateContent);
      }
    })();
  }, []);

  return (
    <>
      {template ? (
        <TemplateContent
          field={field}
          template={template}
          forceUpdate={forceUpdate}
          orgName={orgName}
          templateContent={templateContent}
        />
      ) : (
        <TemplateList forceUpdate={forceUpdate} loading={loading} templateTabs={TEMPLATE_TABS} />
      )}
    </>
  );
};

export default forwardRef(CreateTemplate);
