import { request } from 'ice';

export const listUsers = async () => {
  return await request.get('/api/org/listUsers');
};

export const createOrg = async () => {
  return await request.post('/api/org/create');
};
