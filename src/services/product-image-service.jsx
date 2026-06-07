import productApi from "./api";

export const uploadFileToS3 = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await productApi.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const fileUrl = response.data;
  return {
    url: fileUrl,
    imageName: fileUrl,
  };
};

export const createProductImages = async (productId, imageNames) => {
  const response = await productApi.post(
    `/product-image/${productId}/images`,
    imageNames
  );

  return response.data;
};

export const deleteProductImages = async (imageIds) => {
  await productApi.delete("/product-image", {
    data: imageIds,
  });
};
