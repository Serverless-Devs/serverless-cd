import React, { useEffect, useState } from 'react';
import { Tab, Loading } from '@alicloud/console-components';
import { TEMPLATE_TABS, REGISTRY_URL, SERVERLESS_DEVS_LIST_PACKAGE } from '../constant';
import { map, size, get } from 'lodash';
import { setSearchParams } from '@/utils/index';
import AppCard from '@serverless-cd/app-card-ui';
import fetch from 'node-fetch';

const TemplateList = ({ forceUpdate }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await fetch(REGISTRY_URL);
      const data = await response.json();
      const templateList_all = get(data, 'Response');
      let templateContent: any = [];
      templateList_all.find((template) => {
        if (SERVERLESS_DEVS_LIST_PACKAGE.includes(template.package)) {
          templateContent.push(template);
        }
      });
      let devsTab: any = TEMPLATE_TABS.find((item) => item.key === 'devs');
      TEMPLATE_TABS.splice(TEMPLATE_TABS.indexOf(devsTab), 1, {
        ...devsTab,
        templateList: templateContent,
      });
      setLoading(false);
    })();
  }, []);
  return (
    <>
      <div className="mb-16">基于模版快速创建应用，简单上手体验 Serverless-CD：</div>
      <Loading visible={loading}>
        <Tab
          size="small"
          shape="capsule"
          className="applications-template-tab"
          // onChange={(activeIndex: number) => setActiveKey(activeIndex)}
          // extra={
          //   <div className="applications-template-tab-search">
          //     <Search
          //       placeholder={intl('applications.template.search.placeholder')}
          //       style={{ maxWidth: 400 }}
          //       hasClear
          //       onSearch={search => {
          //         setSearchValue(search);
          //       }}
          //       onChange={search => {
          //         if (!search) {
          //           setSearchValue('');
          //         }
          //       }}
          //     />
          //   </div>
          // }
        >
          {map(TEMPLATE_TABS, (tab) => (
            <Tab.Item title={`${tab.name} ${size(tab.templateList)}`} key={tab.key}>
              <div className="applications-template pt-8">
                {map(tab.templateList, (item: any) => (
                  <AppCard
                    dataSouce={item}
                    column={3}
                    onCreate={(data) => {
                      setSearchParams({ template: data['package'] });
                      forceUpdate?.();
                    }}
                    key={item.package}
                  />
                ))}
              </div>
            </Tab.Item>
          ))}
        </Tab>
      </Loading>
    </>
  );
};

export default TemplateList;
