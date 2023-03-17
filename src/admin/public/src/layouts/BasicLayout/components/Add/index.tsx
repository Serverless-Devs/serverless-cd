import React, { FC } from 'react';
import { Dropdown, Menu, Icon } from '@alicloud/console-components';
import { history } from 'ice';
import style from 'styled-components';

const StyledMenu = style.div`
.next-menu{
  width: 180px;
  border: 1px solid #dadee3;
  border-radius: .28571429rem;
  box-shadow: 0 4px 8px -2px rgb(9 30 66 / 25%), 0 0 1px 0 rgb(9 30 66 / 31%);
  .next-menu-item{
    padding: 4px 16px;
  }
  .border-bottom {
    border-bottom: 1px solid #e3e9ed!important;
  }
}
`;

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
      <StyledMenu>
        <Menu onItemClick={onItemClick}>
          <Menu.Item key="/create" className="border-bottom">
            新建应用
          </Menu.Item>
          <Menu.Item key="/createOrg" className="border-bottom">
            新建团队
          </Menu.Item>
          <Menu.Item key="/addMember">添加成员</Menu.Item>
        </Menu>
      </StyledMenu>
    );
  };
  return (
    <Dropdown
      trigger={<Icon type="plus-circle-fill" className="pr-8 mr-8" style={{ color: '#0070cc' }} />}
      offset={[0, 0]}
    >
      {menu()}
    </Dropdown>
  );
};

export default Add;
