import { runApp, IAppConfig, history } from 'ice';
import React from 'react';
import { Toast } from './components/ToastContainer';
import { userInfo } from '@/services/user';
import { get } from 'lodash';
import { CODE, ORG_NAME } from '@/constants';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    getInitialData: async (ctx) => {
      const user = get(ctx, 'pathname', '') === '/auth' ? {} : await userInfo();
      return {
        initialStates: {
          user: {
            userInfo: user,
          },
        },
      };
    },
  },
  request: {
    interceptors: {
      request: {
        onConfig: (config) => {
          // 发送请求前：可以对 RequestConfig 做一些统一处理
          if (config.url === '/api/user/info') return config;
          const orgName = get(window, ORG_NAME);
          if (orgName) {
            config.params = { ...config.params, orgName };
          }
          return config;
        },
      },
      response: {
        onConfig: (response) => {
          if (response.data.code === 302) {
            history?.push('/');
            return response;
          }
          if (response.data.code === CODE.NeedLogin) {
            history?.push('/login');
            return response;
          }
          if (response.data.code === CODE.Forbidden) {
            history?.push('/noAuth');
            return response;
          }
          if (!response.data.success && response.data.message) {
            const tokenInvalid = response.data.code === CODE.Invalid && response.data.message === 'token 无效，请重新配置';
            !tokenInvalid && Toast.error(response.data.message);
          }
          return response;
        },
        onError: (error: any) => {
          if (error.response.status === CODE.NeedLogin) {
            history?.push('/login');
          } else {
            error.response.data.message && Toast.error(error.response.data.message);
          }
          return Promise.reject(error);
        },
      },
    },
  },
  router: {
    type: 'browser',
    fallback: <div></div>,
  },
};

runApp(appConfig);
