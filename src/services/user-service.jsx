import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put("/users/me", userData);
  return response.data;
};
