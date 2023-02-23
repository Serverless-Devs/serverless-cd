import { request } from 'ice';

export const userInfo = async () => {
  const res = await request.get('/api/user/info');
  return res.data;
};

export const listOrgs = async () => {
  const res = await request.get('/api/user/listOrgs');
  return res.data;
};

export const updateUserProviderToken = async (params) => {
  return await request.put('/api/user/token', {
    data: params,
  });
};
