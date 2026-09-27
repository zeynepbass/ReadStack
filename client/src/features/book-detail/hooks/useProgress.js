import { useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookKeys, patchBook, upsertBook } from "@/shared/queries/books";
import { bookDetailRepository } from "../repositories/bookDetail.repository";

export function useUpdateProgress({ onError } = {}) {
  const queryClient = useQueryClient();
  const timers = useRef({});

  const { mutate } = useMutation({
    mutationFn: (form) => bookDetailRepository.updateProgress(form),
    onSuccess: (doc) => upsertBook(queryClient, doc),
    onError: (err) => {
      onError?.(err);
      queryClient.invalidateQueries({ queryKey: bookKeys.all });
    },
  });

  return useCallback(
    (id, progress) => {
      patchBook(queryClient, id, { progress });
      clearTimeout(timers.current[id]);
      timers.current[id] = setTimeout(() => mutate({ id, progress }), 400);
    },
    [queryClient, mutate]
  );
}
