import React, { FC } from 'react';
import { Dropdown, Menu, Icon } from '@alicloud/console-components';
import { history } from 'ice';
import { localStorageGet } from '@/utils';

type Props = {
  orgName: string;
};

const Add: FC<Props> = (props) => {
  const orgName = props.orgName || localStorageGet('orgName');

  const menu = () => {
    const onItemClick = (url: string) => {
      history?.push(url);
    };

    return (
      <Menu onItemClick={onItemClick}>
        <Menu.Item key={`/${orgName}/create`} className="border-bottom">
          新建应用
        </Menu.Item>
        <Menu.Item key={`/organizations?showSlide=true&activeTab=orgs`} className="border-bottom">
          新建团队
        </Menu.Item>
        <Menu.Item key={`/${orgName}/settings?showSlide=true&activeTab=members`}>
          添加成员
        </Menu.Item>
      </Menu>
    );
  };
  return (
    <Dropdown
      trigger={
        <div className="layout-center mr-16 cursor-pointer">
          <Icon type="plus-circle-fill" style={{ color: '#0070cc' }} />
        </div>
      }
      offset={[0, 0]}
    >
      {menu()}
    </Dropdown>
  );
};

export default Add;
