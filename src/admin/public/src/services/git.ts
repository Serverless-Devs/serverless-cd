import { request } from 'ice';

export const githubRepos = () => {
  return request.get('/api/github/repos');
};

export const githubOrgs = () => {
  return request.get('/api/github/orgs');
};

export const githubOrgRepos = (params) => {
  return request.get('/api/github/orgRepos', { params });
};

export const githubBranches = async (params) => {
  const { data } = await request.get('/api/github/branches', { params });
  return data;
};

export const githubPutFile = async (body) => {
  return await request.post('/api/github/putFile', body);
};

export const checkFile = async (body) => {
  return await request.post('/api/github/checkFile', body);
};
