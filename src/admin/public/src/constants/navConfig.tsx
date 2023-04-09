import Icon, { TeamOutlined, ProfileOutlined, KeyOutlined } from '@ant-design/icons';
import React from 'react';
import { CUSTOMICON } from '@/constants'; 

export const getMenuPath = ({ orgName }) => {
  return {
    team: `/${orgName}/team`,
    members: `/${orgName}/setting/members`,
    secrets: `/${orgName}/setting/secrets`,
    bind: `/${orgName}/setting/bind`,
    teamSetting: `/${orgName}/setting/org`,
  };
};

const TEAMSETICON = (props) => (
  <Icon component={CUSTOMICON.TEAMSET} {...props} />
);

const BINDICON = (props) => (
  <Icon component={CUSTOMICON.BIND} {...props} />
);

export const getMenuConfig = ({ orgName }) => {
  const menuPath = getMenuPath({ orgName });
  const data = {};
  for (const key in menuPath) {
    data[menuPath[key]] = [
      {
        name: '应用模版',
        path: menuPath.team,
        icon: <ProfileOutlined style={{ marginRight: 6 }} />,
      },
      {
        name: '成员管理',
        path: menuPath.members,
        icon: <TeamOutlined style={{ marginRight: 6 }} />,
      },
      {
        name: 'Git源绑定',
        path: menuPath.bind,
        icon: <BINDICON style={{ marginRight: 6 }} />,
      },
      {
        name: '密钥配置',
        path: menuPath.secrets,
        icon: <KeyOutlined style={{ marginRight: 6 }} />,
      },
      {
        name: '团队设置',
        path: menuPath.teamSetting,
        icon: <TEAMSETICON style={{ marginRight: 6 }} />,
      },
    ];
  }
  return data;
};

export const getUserSettingMenuPath = ({ orgName }) => {
  return {
    organizations: `/${orgName}/profile/organizations`,
    accountInformation: `/${orgName}/profile/account_information`,
  };
};

export const getUserSettingMenuConfig = ({ orgName }) => {
  const menuPath = getUserSettingMenuPath({ orgName });
  const data = {};
  for (const key in menuPath) {
    data[menuPath[key]] = [
      {
        name: '新建团队',
        path: menuPath.organizations,
        icon: <ProfileOutlined style={{ marginRight: 6 }} />,
      },
      {
        name: '账号信息',
        path: menuPath.accountInformation,
        icon: <TeamOutlined style={{ marginRight: 6 }} />,
      },
    ];
  }
  return data;
};
