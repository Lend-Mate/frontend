import api from "./api";

const ENDPOINT = "/products";

export const createProduct = async (productData) => {
  const response = await api.post(ENDPOINT, productData);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response.data;
};

export const getAllProducts = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`${ENDPOINT}/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`${ENDPOINT}/${id}`);
};