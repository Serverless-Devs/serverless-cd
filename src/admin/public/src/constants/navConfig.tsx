import { values } from 'lodash';
export const PATH = {
  TEAM: '/team',
  // SETTINGS: '/settings',
  // APPLICATION: '/application/:appId',
};

export const menuConfig = values(PATH);

export const getMenuConfig = (appId) => {
  return {
    [PATH.TEAM]: [
      {
        name: '应用模版',
        path: PATH.TEAM,
      },
    ],
    // [PATH.SETTINGS]: [
    //   {
    //     name: 'Tokens',
    //     path: '/settings/tokens',
    //     icon: 'key',
    //   },
    //   {
    //     name: 'Secrets',
    //     path: '/settings/secrets',
    //     icon: 'Directory-tree',
    //   },
    // ],
    // [PATH.APPLICATION]: [
    //   {
    //     name: '应用详情',
    //     path: `/application/${appId}/detail`,
    //     icon: 'detail',
    //   },
    // ],
  };
};
