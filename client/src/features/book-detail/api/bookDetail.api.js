import api from "@/shared/apiClient";

export const bookDetailApi = {
  getById: (id) => api.get(`/prs/${id}`).then((res) => res.data),
  updateProgress: (id, payload) => api.patch(`/prs/${id}/progress`, payload).then((res) => res.data),
  addNote: (id, payload) => api.post(`/prs/${id}/notes`, payload).then((res) => res.data),
};
