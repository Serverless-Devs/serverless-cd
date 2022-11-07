import { request } from "ice";

export const loginOut = async () => {
  const res = await request.post("/api/user/loginout");
  return res.data;
};

export const userInfo = async () => {
  const res = await request.post("/api/user/userInfo");
  return res.data;
};

export const updateUserInfo = async (params) => {
  const res = await request.post("/api/user/updateUserProviderToken", {
    data: params
  });
  return res.data;
};

export const addOrCompileSecrets = async (data) => {
  return await request.post("/api/user/addOrCompileSecrets", { data });
};

export const gitGlobalSecrets = async () => {
  return await request.get("/api/user/globalSecrets");
};


