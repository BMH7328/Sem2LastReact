import axios from "axios";

import { API_URL } from "./data";

export const createFavorite = async (data) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/favorites",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  });
  return response.data;
};

export const fetchFavorites = async (token = "") => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/favorites",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const deleteFavorites = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/favorites/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
