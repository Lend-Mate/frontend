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

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      Array.from(atob(base64), (c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getOwnerIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  return payload.userId || null;
};