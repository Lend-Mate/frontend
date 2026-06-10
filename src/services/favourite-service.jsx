import {productApi} from "./api";

export const getFavourites = async (userId) => {
  const response = await productApi.get("/favourites/user/" + userId);
  return response.data;
};

export const addFavourite = async (favouriteRequest) => {
  const response = await productApi.post("/favourites", favouriteRequest);
  return response.data;
};
