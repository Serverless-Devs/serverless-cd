import { request } from "ice";

export const getTaskList = async (params) => {
  const { data } = await request.get("/api/task/list", {
    params
  });
  return data
};

export const getTask = async (params) => {
  const { data } = await request.get("/api/task/get", {
    params
  });
  return data
};

export const getTaskLog = async (params) => {
  const { data } = await request.get("/api/task/log", {
    params
  });
  return data
};

export const removeTaskCommit = async (body) => {
  return await request.post("/api/task/remove", body);
};

export const redeployTask = async (body) => {
  return await request.post("/api/deploy/redeploy", body);
};

export const manualDeployApp = async (body) => {
  return await request.post('/api/deploy/manual', body);
};

export const cancelDeployTask = async (body) => {
  return await request.post('/api/deploy/cancel', body);
};



