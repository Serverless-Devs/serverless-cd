import { request } from 'ice';

export const createApp = async (body) => {
  return await request.post('/api/application/create', body);
};

export const listApp = async () => {
  const { data } = await request.get('/api/application/list');
  return data;
};

export const applicationDetail = async (params) => {
  return await request.get('/api/application/detail', {
    params,
  });
};

export const deleteApp = async (params) => {
  return await request.delete('/api/application/delete', {
    params,
  });
};

export const updateApp = async (body) => {
  return await request.post('/api/application/update', body);
};

export const removeEnv = async (body) => {
  return await request.post('/api/application/removeEnv', body);
};

export const createByTemplate = async (params) => {
  return await request.post('/api/application/createByTemplate', {
    params,
  });
};
