import { PRIORITY_TO_API, STATUS_ACTIONS } from "@/shared/utils/books";

export const libraryAdapter = {
  toSearchParams: ({ search, prio }) => ({
    ...(search && { search }),
    ...(prio !== "all" && { priority: PRIORITY_TO_API[prio] }),
  }),
  toCreateRequest: ({ title, author, pages, priority, genre, year, description }) => ({
    title,
    author,
    fileCount: pages,
    priority: PRIORITY_TO_API[priority],
    genre,
    year,
    description,
  }),
  toStatusAction: (status) => STATUS_ACTIONS[status],
  toStatusRequest: (version) => ({ version }),
};
