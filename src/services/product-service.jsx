import {productApi} from "./api";

export const getAllProducts = async () => {
  const response = await productApi.get("/products");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await productApi.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await productApi.post("/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await productApi.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  await productApi.delete(`/products/${id}`);
};

export const getAllCategories = async () => {
  const response = await productApi.get("/categories");
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await productApi.get(`/categories/${id}`);
  return response.data;
};