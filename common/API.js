import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { safeParseJSON } from "./helpers";

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

export const getRequest = async (url) => {
  let response;
  try {
    response = await axios.get(url);
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response;
    }
  }
};

export const postRequest = async (url, data) => {
  let response;
  try {
    response = await axios.post(url, data);
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response;
    }
  }
};

export const getRequestAuthed = async (url) => {
  const user = safeParseJSON(Cookies.get("user"));
  let response;
  try {
    response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user.token.access_token}`,
      },
    });
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response;
    }
  }
};

export const postRequestAuthed = async (url, data) => {
  const user = safeParseJSON(Cookies.get("user"));
  let response;
  try {
    response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${user.token.access_token}`,
      },
    });
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response;
    }
  }
};

export const putRequestAuthed = async (url, data) => {
  const user = safeParseJSON(Cookies.get("user"));
  let response;
  try {
    response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${user.token.access_token}`,
      },
    });
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response;
    }
  }
};

export const deleteRequestAuthed = async (url) => {
  const user = safeParseJSON(Cookies.get("user"));
  let response;
  try {
    response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${user.token.access_token}`,
      },
    });
    return response;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return err.response;
    }
  }
};
