import { useQuery, useQueryClient } from "@tanstack/react-query";
import { bookKeys, upsertBook } from "@/shared/queries/books";
import { bookDetailRepository } from "../repositories/bookDetail.repository";

export function useBookDetail(id) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: async () => {
      const doc = await bookDetailRepository.getById(id);
      upsertBook(queryClient, doc);
      return doc;
    },
    enabled: Boolean(id),
    initialData: () => queryClient.getQueryData(bookKeys.list)?.find((p) => p._id === id),
    initialDataUpdatedAt: 0,
  });
}
