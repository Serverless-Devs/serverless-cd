import React, { FC, useState } from 'react';
import { Dropdown, Menu } from '@alicloud/console-components';
import { history, useRequest } from 'ice';
import { listUsers } from '@/services/org';
import Icons from '@/components/Icon';
import Icon from '@ant-design/icons';
import { CUSTOMICON } from '@/constants';
import AddMember from '@/pages/Members/components/AddMember';
import CreateOrg from '@/pages/CreateOrg';
import { map } from 'lodash';

type Props = {
  orgName: string;
};

const Add: FC<Props> = (props) => {
  const { orgName } = props;
  const { data, refresh } = useRequest(listUsers);
  const [memberVisible, setMemberVisible] = useState(false);
  const [orgVisible, setOrgVisible] = useState(false);

  const menu = () => {
    const onItemClick = (url: string) => {
      if (url.indexOf('/setting/members') > -1) {
        return setMemberVisible(true);
      }
      if (url.indexOf('/organizations/create') > -1) {
        return setOrgVisible(true);
      }
      return history?.push(url);
    };

    const ADDAPPIcon = (props) => <Icon component={CUSTOMICON['ADDAPP']} {...props} />;
    const ADDTEAMIcon = (props) => <Icon component={CUSTOMICON['ADDTEAM']} {...props} />;
    const ADDMEMBERICON = (props) => <Icon component={CUSTOMICON['ADDMEMBER']} {...props} />;
    const MENUICON = {
      NEWAPP: <ADDAPPIcon style={{ marginRight: '6px' }} />,
      NEWTEAM: <ADDTEAMIcon style={{ marginRight: '6px' }} />,
      NEWMEMBER: <ADDMEMBERICON style={{ marginRight: '6px' }} />,
    };
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
  const ADDICON = (props) => <Icon component={CUSTOMICON['ADD']} {...props} />;

  const handleCreateOrgCallback = () => {
    history?.push(`/${orgName}/profile/organizations=${Date.now}`);
  };

  const changeVisible = {
    orgVisible: (bol: boolean) => setOrgVisible(bol),
    memberVisible: (bol: boolean) => setMemberVisible(bol),
  };

  return (
    <React.Fragment>
      <Dropdown
        trigger={
          <div
            className="layout-center mr-16 cursor-pointer header-add-icon"
            style={{ fontSize: '32px' }}
          >
            <Icons type="add" className="add-icon" />
            <ADDICON className="add-icon-hover" />
          </div>
        }
        align="tr br"
        offset={[0, 0]}
      >
        {menu()}
      </Dropdown>
      <AddMember
        callback={refresh}
        existUsers={map(data, (item) => item.username)}
        active={memberVisible}
        orgName={orgName}
        changeVisible={changeVisible.memberVisible}
      />
      <CreateOrg
        callback={handleCreateOrgCallback}
        active={orgVisible}
        changeVisible={changeVisible.orgVisible}
        orgName={orgName}
      />
    </React.Fragment>
  );
};

export default Add;
