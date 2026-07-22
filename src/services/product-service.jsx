import { productApi } from "./api";

export const getAllProducts = async ({
  page = 0,
  size = 5,
  sortBy,
  ascending = true,
  categoryId,
  brands,
  minPrice,
  maxPrice,
  minRentalDays,
  maxRentalDays,
} = {}) => {
  const response = await productApi.get("/products", {
    params: {
      page,
      size,
      sortBy,
      ascending,
      categoryId,
      brands,
      minPrice,
      maxPrice,
      minRentalDays,
      maxRentalDays,
    },
  });

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

export const searchProducts = async ({
  text,
  page = 0,
  size = 5,
  sortBy = "id",
  ascending = true,
  categoryId,
  brands,
  minPrice,
  maxPrice,
  minRentalDays,
  maxRentalDays,
}) => {
  const response = await productApi.get("/products/search", {
    params: {
      text,
      page,
      size,
      sortBy,
      ascending,
      categoryId,
      brands,
      minPrice,
      maxPrice,
      minRentalDays,
      maxRentalDays,
    },
  });

  return response.data;
};

export const getUniqueBrands = async ({
  text,
  categoryId,
  brands,
  minPrice,
  maxPrice,
  minRentalDays,
  maxRentalDays,
}) => {
  const response = await productApi.get(`/products/brands`, {
    params: {
      text,
      categoryId,
      brands,
      minPrice,
      maxPrice,
      minRentalDays,
      maxRentalDays,
    }
  });
  return response.data;
};

export const getAllProductsByOwnerId = async ({
  page = 0,
  size = 5,
  sortBy = "id",
  ascending = true,
  ownerId,
} = {}) => {
  const response = await productApi.get(`/products/user`, {
    params: {
      page,
      size,
      sortBy,
      ascending,
      ownerId
    },
  });

  return response.data.content;
};

export const createAvailability = async ({
  productId,
  startDate,
  endDate,
  reason,
} = {}) => {
  const response = await productApi.post(`/product-availability`, {
    productId,
    startDate,
    endDate,
    reason
  });
  return response.data;
};

export const deleteAvailability = async (id) => {
  const response = await productApi.delete(`/product-availability`, {
    params: {
      id
    },
  });
  return response.data;
};

export const getFavoritesByUser = async (id) => {
  const response = await productApi.get(`/favourites/user/${id}`);
  return response.data;
};