import { request } from 'ice';

export const accountLogin = async (body) => {
  return await request.post('/api/auth/login', body);
};

export const accountSignUp = async (body) => {
  return await request.post('/api/auth/signUp', body);
};

export const logout = async () => {
  const res = await request.post('/api/auth/logout');
  return res.data;
};

export const accountBinding = async (body) => {
  return await request.post('/api/auth/callback/bindingAccount', body);
};

export const getAuthGithub = async (body) => {
  return await request.post('/api/auth/callback/github', body);
};

export const getAuthGitee = async (body) => {
  return await request.post('/api/auth/callback/gitee', body);
};

export const accountSingupAuth = async (body) => {
  return await request.post('/api/auth/callback/auth', body);
};

export const updateInfo = async (body) => {
  const res = await request.post('/api/auth/updata', body);
  return res.data;
};