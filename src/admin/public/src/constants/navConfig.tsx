export const getMenuPath = ({ orgName }) => {
  return {
    team: '/team',
    members: `/${orgName}/setting/members`,
    secrets: `/${orgName}/setting/secrets`,
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
      },
      {
        name: '成员管理',
        path: menuPath.members,
      },
      {
        name: '密钥配置',
        path: menuPath.secrets,
      },
      {
        name: '团队设置',
        path: menuPath.teamSetting,
      },
    ];
  }
  return data;
};
