import axios from "axios";

const productApi = axios.create({
  baseURL: "http://178.104.91.123/api", // product service port — application.properties'e göre değiştir
  headers: { "Content-Type": "application/json" },
});

productApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

productApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
    const message = error.response?.data?.message || "Beklenmeyen bir hata oluştu.";
    return Promise.reject(new Error(message));
  }
);

export default productApi;