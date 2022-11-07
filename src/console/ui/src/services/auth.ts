import { request } from "ice";

export const githubAuth = async () => {
  return await request.get("/api/auth/url/github");
};

export const accountLogin = async (body) => {
  return await request.post("/api/auth/account/login", body);
};

export const accountSignUp = async (body) => {
  return await request.post("/api/auth/account/signUp", body);
};

export const accountBinding = async (body) => {
  return await request.post("/api/auth/callback/bindingAccount", body);
};

export const getAuthGithub = async (params) => {
  return await request.get("/api/auth/callback/github", {
    params
  });
};

export const getSupportLoginTypes = async () => {
  return await request.get("/api/auth/account/supportLoginTypes");
};






