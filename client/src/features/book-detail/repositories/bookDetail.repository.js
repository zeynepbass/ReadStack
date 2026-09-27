import { bookDetailAdapter } from "../adapter/bookDetail.adapter";
import { bookDetailApi } from "../api/bookDetail.api";

export const bookDetailRepository = {
  getById: (id) => bookDetailApi.getById(id),
  updateProgress: ({ id, progress }) => bookDetailApi.updateProgress(id, bookDetailAdapter.toProgressRequest(progress)),
  addNote: ({ id, text, page }) => bookDetailApi.addNote(id, bookDetailAdapter.toNoteRequest({ text, page })),
};
