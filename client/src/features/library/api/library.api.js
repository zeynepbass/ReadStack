import api from "@/shared/apiClient";

export const libraryApi = {
  list: (params) => api.get("/prs", { params }).then((res) => res.data),
  create: (payload) => api.post("/prs", payload).then((res) => res.data),
  changeStatus: (id, action, payload) => api.patch(`/prs/${id}/${action}`, payload).then((res) => res.data),
};
