import {userApi} from "./api";

export const getProfile = async () => {
  const response = await userApi.get("/users/me");
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await userApi.put("/users/me", userData);
  return response.data;
};
