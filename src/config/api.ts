import axios, { AxiosError } from "axios";
import { externalUnsetSession, getAccessToken } from "../storage";

export const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH;
const API = axios.create({ baseURL: API_BASE_PATH });

API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      externalUnsetSession();
    }
    return Promise.reject(error);
  }
);

export const getAuthorizedHeader = (access_token?: string) => {
  const storedToken = getAccessToken();
  return { authorization: `Bearer ${access_token || storedToken}` };
};

export { API };
