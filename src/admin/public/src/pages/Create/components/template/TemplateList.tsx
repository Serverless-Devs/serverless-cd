import React from 'react';
import { Tab } from '@alicloud/console-components';
import { TEMPLATE_TABS } from '../constant';
import { map, size } from 'lodash';
import { setSearchParams } from '@/utils/index';
import AppCard from '@serverless-cd/app-card-ui';

const TemplateList = ({ forceUpdate }) => {
  return (
    <>
      <div className="mb-16">基于模版快速创建应用，简单上手体验 Serverless-CD：</div>
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
          <Tab.Item
            title={`${tab.name} ${size(tab.templateList)}`}
            key={tab.key}
          >
            <div className="applications-template pt-8">
              {map(tab.templateList, (item) => (
                <AppCard
                  dataSouce={item}
                  column={3}
                  onCreate={(data) => {
                    setSearchParams({ template: data['package'] })
                    forceUpdate?.()
                  }}
                  key={item.package}
                />
              ))}
            </div>
          </Tab.Item>
        ))}
      </Tab>
    </>

  )
}

export default TemplateList