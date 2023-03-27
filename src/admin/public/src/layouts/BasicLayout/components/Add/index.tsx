import React, { FC } from 'react';
import { Dropdown, Menu } from '@alicloud/console-components';
import { history } from 'ice';
import Icon from '@/components/Icon';

type Props = {
  orgName: string;
};

const Add: FC<Props> = (props) => {
  const { orgName } = props;
  const menu = () => {
    const onItemClick = (url: string) => {
      history?.push(url);
    };

    return (
      <Menu onItemClick={onItemClick}>
        <Menu.Item key={`/${orgName}/create`} className="border-bottom">
          新建应用
        </Menu.Item>
        <Menu.Item key={`/organizations/create`} className="border-bottom">
          新建团队
        </Menu.Item>
        <Menu.Item key={`/${orgName}/setting/members?showSlide=true`}>添加成员</Menu.Item>
      </Menu>
    );
  };
  return (
    <Dropdown
      trigger={
        <div className="layout-center mr-16 cursor-pointer">
          <Icon type="add" />
        </div>
      }
      offset={[0, 0]}
    >
      {menu()}
    </Dropdown>
  );
};

export default Add;
