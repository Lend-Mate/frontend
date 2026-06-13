import { productApi } from "./api";

export const getFavourites = async (userId) => {
  const response = await productApi.get(`/favourites/user/${userId}`);
  return response.data;
};

export const getFavouriteById = async (id) => {
  const response = await productApi.get(`/favourites/${id}`);
  return response.data;
};

export const getAllFavourites = async () => {
  const response = await productApi.get("/favourites");
  return response.data;
};

export const addFavourite = async (favouriteRequest) => {
  const response = await productApi.post("/favourites", favouriteRequest);
  return response.data;
};

export const updateFavourite = async (id, favouriteRequest) => {
  const response = await productApi.put(
    `/favourites/${id}`,
    favouriteRequest
  );
  return response.data;
};

export const deleteFavourite = async (id) => {
  await productApi.delete(`/favourites/${id}`);
};