import axios, { AxiosError } from "axios";
import { externalUnsetSession, getAccessToken } from "../storage";

export const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH;
const API = axios.create({ baseURL: API_BASE_PATH });

type TokenGetter = () => Promise<string | undefined>;

// Password sign-in keeps its token in the session store. Auth0 sign-in
// replaces this with the SDK's getAccessTokenSilently, which keeps tokens in
// memory and refreshes them when they expire.
let getToken: TokenGetter = async () => getAccessToken();

export const setTokenGetter = (getter: TokenGetter) => {
  getToken = getter;
};

API.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      externalUnsetSession();
    }
    return Promise.reject(error);
  },
);

export { API };
