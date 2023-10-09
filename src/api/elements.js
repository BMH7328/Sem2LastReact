import axios from "axios";

import { API_URL } from "./data";

export const fetchElements = async () => {
  const response = await axios.get(API_URL + "/elements");
  return response.data;
};

export const addElement = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/elements",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const uploadElementImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/images",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const deleteElement = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/elements/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
