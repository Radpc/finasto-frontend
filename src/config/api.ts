import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  externalUnsetSession,
  getAccessToken,
  getSelectedFamilyId,
} from "../storage";

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

// The API acts on one family per request. A familyId the request carries
// itself (a create form's family picker) wins over the one selected in the
// top bar, so the two never disagree.
const familyIdFor = (config: InternalAxiosRequestConfig) => {
  const fromBody = (config.data as { familyId?: unknown } | undefined)
    ?.familyId;
  const fromQuery = (config.params as { familyId?: unknown } | undefined)
    ?.familyId;
  const explicit = [fromBody, fromQuery].find(
    (id): id is string => typeof id === "string" && id.length > 0,
  );
  return explicit ?? getSelectedFamilyId();
};

API.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const familyId = familyIdFor(config);
  if (familyId) config.headers["X-Family-Id"] = familyId;
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
