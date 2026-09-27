export const bookKeys = {
  all: ["books"],
  list: ["books", "list"],
  searches: ["books", "search"],
  search: (filters) => ["books", "search", filters],
  detail: (id) => ["books", "detail", id],
  status: ["books", "status"],
};

const replaceBook = (list, doc) =>
  list.some((p) => p._id === doc._id) ? list.map((p) => (p._id === doc._id ? doc : p)) : [...list, doc];

export function upsertBook(queryClient, doc) {
  queryClient.setQueryData(bookKeys.list, (list) => (list ? replaceBook(list, doc) : list));
  queryClient.setQueryData(bookKeys.detail(doc._id), doc);
}

export function patchBook(queryClient, id, patch) {
  queryClient.setQueryData(bookKeys.list, (list) => list?.map((p) => (p._id === id ? { ...p, ...patch } : p)));
  queryClient.setQueryData(bookKeys.detail(id), (doc) => doc && { ...doc, ...patch });
}

export function findBook(queryClient, id) {
  return (
    queryClient.getQueryData(bookKeys.list)?.find((p) => p._id === id) ?? queryClient.getQueryData(bookKeys.detail(id))
  );
}
