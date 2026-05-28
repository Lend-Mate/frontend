import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  // backend düz string döndürüyor
  const token = response.data;
  localStorage.setItem("token", token);
  return token;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};