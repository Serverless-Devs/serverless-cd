import React, { FC } from 'react';
import { Dropdown, Menu, Icon } from '@alicloud/console-components';
import { history } from 'ice';

type Props = {
  orgName: string;
};

const Add: FC<Props> = (props) => {
  const { orgName } = props;
  const menu = () => {
    const onItemClick = (key: string) => {
      history?.push(`/${orgName}${key}`);
    };

    return (
      <Menu onItemClick={onItemClick}>
        <Menu.Item key="/create" className="border-bottom">
          新建应用
        </Menu.Item>
        <Menu.Item key="/createOrg" className="border-bottom">
          新建团队
        </Menu.Item>
        <Menu.Item key="/addMember">添加成员</Menu.Item>
      </Menu>
    );
  };
  return (
    <Dropdown
      trigger={
        <div className="layout-center">
          <Icon type="plus-circle-fill" className="pr-8 mr-8" style={{ color: '#0070cc' }} />
        </div>
      }
      offset={[0, 0]}
    >
      {menu()}
    </Dropdown>
  );
};

export default Add;
