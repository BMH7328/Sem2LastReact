import axios from "axios";

import { API_URL } from "./data";

export const fetchWeapons = async (weapontype) => {
  const response = await axios.get(
    API_URL +
      "/weapons?" +
      (weapontype !== "" ? "weapontype=" + weapontype : "")
  );
  return response.data;
};

export const getWeapon = async (id) => {
  const response = await axios.get(API_URL + "/weapons/" + id);
  return response.data;
};

export const addWeapon = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/weapons",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const addWeaponImage = async (file) => {
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

export const uploadWeaponImage = async (file) => {
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

export const updateWeapon = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/weapons/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteWeapon = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/weapons/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
