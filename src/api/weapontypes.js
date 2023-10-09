import axios from "axios";

import { API_URL } from "./data";

export const fetchWeapontypes = async () => {
  const response = await axios.get(API_URL + "/weapontypes");
  return response.data;
};

export const addWeapontype = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/weapontypes",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const uploadWeapontypeImage = async (file) => {
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

export const deleteWeapontype = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/Weapontypes/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
