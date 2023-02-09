import { request } from 'ice';

export const getTokenList = async () => {
  const { data } = await request.get('/api/tokens/list');
  return data;
};

export const createToken = async (body) => {
  return await request.post('/api/tokens/create', body);
};

export const updateTokenInfo = async (body) => {
  return await request.post('/api/tokens/update', body);
};

export const removeToken = async (body) => {
  return await request.post('/api/tokens/delete', body);
};
