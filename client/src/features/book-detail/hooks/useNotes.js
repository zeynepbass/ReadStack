import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertBook } from "@/shared/queries/books";
import { bookDetailRepository } from "../repositories/bookDetail.repository";

export function useAddNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form) => bookDetailRepository.addNote(form),
    onSuccess: (doc) => upsertBook(queryClient, doc),
  });
}
