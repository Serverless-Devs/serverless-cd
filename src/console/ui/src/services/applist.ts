import { request } from 'ice';

export const createApp = async (body) => {
  return await request.post('/api/flow/application/create', body);
};

export const listApp = async () => {
  const { data } = await request.get('/api/flow/application/list');
  return data;
};

export const applicationDetail = async (params) => {
  return await request.get('/api/flow/application/detail', {
    params,
  });
};

export const deleteApp = async (params) => {
  return await request.delete('/api/flow/application/delete', {
    params
  });
};

export const updateApp = async (body) => {
  return await request.post('/api/flow/application/update', body);
};


