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
          if (response.data.code === 302) {
            return history?.push('/');
          }
          if (response.data.code === 401) {
            return history?.push('/login');
          }
          if (!response.data.success && response.data.message) {
            Toast.error(response.data.message);
          }
          return response;
        },
        onError: (error: any) => {
          if (error.response.status === 401) {
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
    fallback: <div></div>
  },
};

runApp(appConfig);
