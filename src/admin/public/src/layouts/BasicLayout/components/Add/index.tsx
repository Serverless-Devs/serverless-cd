import React, { FC } from 'react';
import { Dropdown, Menu } from '@alicloud/console-components';
import { history } from 'ice';
import Icons from '@/components/Icon';
import Icon from '@ant-design/icons';
import { CUSTOMICON } from '@/constants';

type Props = {
  orgName: string;
};

const Add: FC<Props> = (props) => {
  const { orgName } = props;
  const menu = () => {
    const onItemClick = (url: string) => {
      history?.push(url);
    };

    const ADDAPPIcon = (props) => (
      <Icon component={CUSTOMICON['ADDAPP']} {...props} />
    );
    const ADDTEAMIcon = (props) => (
      <Icon component={CUSTOMICON['ADDTEAM']} {...props} />
    );
    const ADDMEMBERICON = (props) => (
      <Icon component={CUSTOMICON['ADDMEMBER']} {...props} />
    );
    const MENUICON = {
      NEWAPP: <ADDAPPIcon style={{ marginRight: '6px' }} />,
      NEWTEAM: <ADDTEAMIcon style={{ marginRight: '6px' }} />,
      NEWMEMBER: <ADDMEMBERICON style={{ marginRight: '6px' }} />,
    }
    return (
      <Menu onItemClick={onItemClick} className="top-bar-menu__wrapper">
        <Menu.Item key={`/${orgName}/create`} className="border-bottom">
          {MENUICON.NEWAPP}新建应用
        </Menu.Item>
        <Menu.Item key={`/organizations/create`} className="border-bottom">
          {MENUICON.NEWTEAM}新建团队
        </Menu.Item>
        <Menu.Item key={`/${orgName}/setting/members?showSlide=true`}>
          {MENUICON.NEWMEMBER}添加成员
        </Menu.Item>
      </Menu>
    );
  };
  return (
    <Dropdown
      trigger={
        <div className="layout-center mr-16 cursor-pointer">
          <Icons type="add" className="add-icon" />
        </div>
      }
      align="tr br"
      offset={[0, 0]}
    >
      {menu()}
    </Dropdown>
  );
};

export default Add;
