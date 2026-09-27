import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookKeys, upsertBook } from "@/shared/queries/books";
import { libraryRepository } from "../repositories/library.repository";

export function useAddBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form) => libraryRepository.create(form),
    onSuccess: (doc) => {
      upsertBook(queryClient, doc);
      queryClient.invalidateQueries({ queryKey: bookKeys.searches });
    },
  });
}
