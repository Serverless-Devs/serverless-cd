import Icon, {
  TeamOutlined,
  ProfileOutlined,
  KeyOutlined,
  ClusterOutlined,
  ControlOutlined,
  AppstoreOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import React from 'react';
import { CUSTOMICON } from '@/constants';
import { split, size } from 'lodash';

const TEAMSETICON = (props) => <Icon component={CUSTOMICON.TEAMSET} {...props} />;

const BINDICON = (props) => <Icon component={CUSTOMICON.BIND} {...props} />;

export const getMenuPath = ({ orgName }) => {
  return {
    team: `/${orgName}/team`,
    members: `/${orgName}/setting/members`,
    cloud: `/${orgName}/setting/cloud`,
    secrets: `/${orgName}/setting/secrets`,
    bind: `/${orgName}/setting/bind`,
    teamSetting: `/${orgName}/setting/org`,
  };
};

export const getMenuConfig = ({ orgName }) => {
  const menuPath = getMenuPath({ orgName });
  const data = {};
  for (const key in menuPath) {
    data[menuPath[key]] = [
      {
        name: '应用模版',
        path: menuPath.team,
        icon: <ProfileOutlined className="mr-6" />,
      },
      {
        name: '成员管理',
        path: menuPath.members,
        icon: <TeamOutlined className="mr-6" />,
      },
      {
        name: '云账号管理',
        path: menuPath.cloud,
        icon: <CloudOutlined className="mr-6" />,
      },
      {
        name: 'Git源绑定',
        path: menuPath.bind,
        icon: <BINDICON className="mr-6" />,
      },
      {
        name: '密钥配置',
        path: menuPath.secrets,
        icon: <KeyOutlined className="mr-6" />,
      },
      {
        name: '团队设置',
        path: menuPath.teamSetting,
        icon: <TEAMSETICON className="mr-6" />,
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
        icon: <ProfileOutlined className="mr-6" />,
      },
      {
        name: '账号信息',
        path: menuPath.accountInformation,
        icon: <TeamOutlined className="mr-6" />,
      },
    ];
  }
  return data;
};

// 环境侧边栏
export const getEnvironmentMenuPath = ({ orgName, pathname }) => {
  if (!orgName) return;
  const pathNames = split(pathname, '/');
  if (size(pathNames) !== 6) return;
  return {
    overview: `/${orgName}/application/${pathNames[3]}/${pathNames[4]}/overview`,
    cicd: `/${orgName}/application/${pathNames[3]}/${pathNames[4]}/cicd`,
    operation: `/${orgName}/application/${pathNames[3]}/${pathNames[4]}/operation`,
  };
};

export const getEnvironmentMenuConfig = ({ orgName, pathname }) => {
  const menuPath = getEnvironmentMenuPath({ orgName, pathname });
  const data = {};
  for (const key in menuPath) {
    data[menuPath[key]] = [
      {
        name: '应用概览',
        path: menuPath.overview,
        icon: <AppstoreOutlined className="mr-6" />,
      },
      {
        name: 'CI/CD',
        path: menuPath.cicd,
        icon: <ClusterOutlined className="mr-6" />,
      },
      {
        name: '运维管理',
        path: menuPath.operation,
        icon: <ControlOutlined className="mr-6" />,
      },
    ];
  }
  return data;
};

// 使用loginLayout 布局路径

export const loginLayoutPathName = [
  '/auth',
  '/signUp',
  '/login',
  // '/noAuth'
]
