import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
const SESSION_KEYS = ["accessToken", "refreshToken", "user"];
const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const storages = () => (typeof window === "undefined" ? [] : [window.localStorage, window.sessionStorage]);

export const session = {
  get(key) {
    for (const storage of storages()) {
      const value = storage.getItem(key);
      if (value) return value;
    }
    return null;
  },
  getUser() {
    try {
      return JSON.parse(this.get("user"));
    } catch {
      return null;
    }
  },
  save({ accessToken, refreshToken, user }, remember = true) {
    this.clear();
    const storage = remember ? window.localStorage : window.sessionStorage;
    storage.setItem("accessToken", accessToken);
    storage.setItem("refreshToken", refreshToken);
    storage.setItem("user", JSON.stringify(user));
  },
  setUser(user) {
    const storage = window.localStorage.getItem("refreshToken") ? window.localStorage : window.sessionStorage;
    storage.setItem("user", JSON.stringify(user));
  },
  setAccessToken(accessToken) {
    const storage = window.localStorage.getItem("refreshToken") ? window.localStorage : window.sessionStorage;
    storage.setItem("accessToken", accessToken);
  },
  clear() {
    storages().forEach((storage) => SESSION_KEYS.forEach((key) => storage.removeItem(key)));
  },
};

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = session.get("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshRequest = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isPublicAuthCall = PUBLIC_AUTH_PATHS.includes(config?.url);

    if (response?.status !== 401 || !config || config._retry || isPublicAuthCall) {
      return Promise.reject(error);
    }

    const refreshToken = session.get("refreshToken");
    if (!refreshToken) {
      session.clear();
      unauthorizedHandler?.();
      return Promise.reject(error);
    }

    try {
      refreshRequest ??= axios.post(`${baseURL}/auth/refresh`, { refreshToken }).finally(() => {
        refreshRequest = null;
      });
      const { data } = await refreshRequest;
      session.setAccessToken(data.accessToken);
      config._retry = true;
      config.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(config);
    } catch {
      session.clear();
      unauthorizedHandler?.();
      return Promise.reject(error);
    }
  }
);

export function getErrorMessage(error, fallback = "Bir hata oluştu") {
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.request && !error.response) return "Sunucuya ulaşılamadı";
  return fallback;
}

export default api;
