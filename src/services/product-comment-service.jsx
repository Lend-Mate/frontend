import {productApi} from "./api";

export const saveProductComment = async (object) => {
  const response = await productApi.post(`/product-comments`, object);
  return response.data;
};