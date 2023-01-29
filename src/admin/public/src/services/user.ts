import { request } from 'ice';

export const userInfo = async () => {
  const res = await request.get('/api/user/info');
  return res.data;
};

export const updateUserProviderToken = async (params) => {
  const res = await request.put('/api/user/token', {
    data: params,
  });
  return res.data;
};

export const addOrCompileSecrets = async (data) => {
  return await request.post('/api/auth/user/addOrCompileSecrets', { data });
};

export const gitGlobalSecrets = async () => {
  return await request.get('/api/auth/user/globalSecrets');
};
