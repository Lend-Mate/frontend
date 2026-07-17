import { productApi } from "./api";
import { getOwnerIdFromToken } from "./auth-service";

export const getCartsByUser = async (userId) => {
  const response = await productApi.get(`/carts/users/${userId}`);
  return response.data;
};

export const addToCart = async (cartRequest) => {
  const response = await productApi.post("/carts", cartRequest);
  return response.data;
};

export const deleteCart = async (id) => {
  await productApi.delete(`/carts/${id}`);
};

export const createOrder = async (object) => {
  const response = await productApi.post("/orders", object);

  return response.data;
};

export const getDeliveredOrders = async () => {
  const userId = getOwnerIdFromToken();
  const response = await productApi.get(`/orders/user/${userId}`);
  return response.data;
};