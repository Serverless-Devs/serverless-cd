import { request } from 'ice';

export const listUsers = async () => {
  const { data } = await request.get('/api/org/listUsers');
  return data;
};

export const createOrg = async (body) => {
  return await request.post('/api/org/create', body);
};

export const inviteUser = async (body) => {
  return await request.post('/api/org/invite', body);
};

export const removeUser = async (body) => {
  return await request.post('/api/org/removeUser', body);
};
