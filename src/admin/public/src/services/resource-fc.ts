import { request } from 'ice';

export const detail = async (body) => {
  return await request.post('/api/resource/fc/status', body);
};

export const eventInvoke = async (body) => {
  return await request.post('/api/resource/fc/eventInvoke', body);
};

export const httpInvoke = async (body) => {
  return await request.post('/api/resource/fc/httpInvoke', body);
};
