import api from "@/shared/apiClient";

export const authApi = {
  login: (payload) => api.post("/auth/login", payload).then((res) => res.data),
  register: (payload) => api.post("/auth/register", payload).then((res) => res.data),
  logout: (payload) => api.post("/auth/logout", payload),
  me: () => api.get("/auth/me").then((res) => res.data),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload).then((res) => res.data),
  resetPassword: (payload) => api.post("/auth/reset-password", payload).then((res) => res.data),
  monthlyStats: () => api.get("/stats/monthly").then((res) => res.data),
};
