import { runApp, IAppConfig, history } from 'ice';
import React from 'react';
import { Toast } from './components/ToastContainer';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
  request: {
    interceptors: {
      response: {
        onConfig: (response) => {
          if (!response.data.success && response.data.message) {
            Toast.error(response.data.message);
          }
          if (response.data.success && response.data.status === 302) {
            history?.push('/');
          }
          return response;
        },
        onError: (error: any) => {
          if (error.response.status === 401) {
            history?.push('/login');
          }
          error.response.data.message && Toast.error(error.response.data.message);
          return Promise.reject(error);
        },
      },
    },
  },
  router: {
    type: 'browser',
    fallback: <div></div>
  },
};

runApp(appConfig);
