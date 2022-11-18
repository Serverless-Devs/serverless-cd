import { request } from "ice";

export const getTaskList = async (params) => {
  const { data } = await request.get("/api/flow/task/list", {
    params
  });
  return data
};

export const getTask = async (params) => {
  const { data } = await request.get("/api/flow/task/get", {
    params
  });
  return data
};

export const getTaskLog = async (params) => {
  const { data } = await request.get("/api/flow/task/log", {
    params
  });
  return data
};

export const removeTaskCommit = async (body) => {
  return await request.post("/api/flow/task/remove", body);
};

export const redeployTask = async (body) => {
  return await request.post("/api/flow/dispatch/redeploy", body);
};

export const manualDeployApp = async (body) => {
  return await request.post('/api/flow/dispatch/manual', body);
};

export const cancelDeployTask = async (body) => {
  return await request.post('/api/flow/dispatch/cancel', body);
};



