export enum PATH {
  SETTINGS = '/settings',
  APPLICATION = '/application/:appId'
}

export const getMenuConfig = (appId) => {
  return {
    [PATH.SETTINGS]: [{
      name: 'Tokens',
      path: '/settings/tokens',
      icon: 'key',
    },
    {
      name: 'Secrets',
      path: '/settings/secrets',
      icon: 'Directory-tree',
    }],
    [PATH.APPLICATION]: [{
      name: '应用详情',
      path: `/application/${appId}/detail`,
      icon: 'detail',
    }]
  }
}

