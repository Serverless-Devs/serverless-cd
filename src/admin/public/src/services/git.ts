import { request } from 'ice';

export const githubRepos = () => {
  return request.get('/api/github/repos');
};

export const githubOrgs = () => {
  return request.get('/api/github/orgs');
};

export const githubOrgRepos= (params) => {
  return request.get('/api/github/orgRepos', {params});
};

export const githubBranches = async (params) => {
  const { data } = await request.get('/api/github/branches', { params });
  return data;
};

export const githubPutFile = async (body) => {
  const { data } = await request.post('/api/github/putFile', body);
  return data;
};

export const checkFile = async (body) => {
  const { data } = await request.post('/api/github/checkFile', body);
  return data;
};

export const getCardData = async (body) => {
  const { data } = await request.post('/api/proxy/appCenter', body);
  console.log('11111122222',data)
  return data;
}