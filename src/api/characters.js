import axios from "axios";

import { API_URL } from "./data";

export const fetchCharacters = async (region, weapontype, element) => {
  const response = await axios.get(
    API_URL +
      "/characters?" +
      (region !== "" ? "region=" + region : "") +
      (weapontype !== "" ? "&weapontype=" + weapontype : "") +
      (element !== "" ? "&element=" + element : "")
  );
  return response.data;
};

export const getCharacter = async (id) => {
  const response = await axios.get(API_URL + "/characters/" + id);
  return response.data;
};

export const addCharacter = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/characters",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const uploadCharacterImage = async (file) => {
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

export const updateCharacter = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/characters/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteCharacter = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/characters/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
