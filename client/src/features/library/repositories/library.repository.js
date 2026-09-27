import { libraryAdapter } from "../adapter/library.adapter";
import { libraryApi } from "../api/library.api";

export const libraryRepository = {
  getAll: () => libraryApi.list(),
  search: (filters) => libraryApi.list(libraryAdapter.toSearchParams(filters)),
  create: (form) => libraryApi.create(libraryAdapter.toCreateRequest(form)),
  changeStatus: ({ id, status, version }) =>
    libraryApi.changeStatus(id, libraryAdapter.toStatusAction(status), libraryAdapter.toStatusRequest(version)),
};
