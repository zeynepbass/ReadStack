import { useMemo } from "react";
import { useMutation, useMutationState, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/shared/apiClient";
import { bookKeys, findBook, patchBook, upsertBook } from "@/shared/queries/books";
import { libraryRepository } from "../repositories/library.repository";

const isSaving = (queryClient, id) =>
  queryClient.isMutating({ mutationKey: bookKeys.status, predicate: (m) => m.state.variables?.id === id }) > 0;

export function useChangeStatus({ onError } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: bookKeys.status,
    mutationFn: (form) => libraryRepository.changeStatus(form),
    onMutate: ({ id, status }) => patchBook(queryClient, id, { status }),
    onSuccess: (doc) => upsertBook(queryClient, doc),
    onError: (err, { current }) => {
      upsertBook(queryClient, current);
      if (err.response?.status === 409) queryClient.invalidateQueries({ queryKey: bookKeys.list });
      onError?.(err);
    },
  });
}

export function useBookActions({ onToast }) {
  const queryClient = useQueryClient();
  const { mutate } = useChangeStatus({
    onError: (err) => onToast({ text: getErrorMessage(err, "Değişiklik kaydedilemedi") }),
  });

  const change = (id, status, message, undoable = true) => {
    const current = findBook(queryClient, id);
    if (!current || current.status === status || isSaving(queryClient, id)) return;
    onToast({ text: `“${current.title}” ${message}`, id, undo: undoable ? current.status : null });
    mutate({ id, status, version: current.version, current });
  };

  return {
    onFinish: (id) => change(id, "approved", "okundu olarak işaretlendi"),
    onDrop: (id) => change(id, "rejected", "bırakıldı"),
    onRestore: (id) => change(id, "pending", "listeye geri alındı"),
    undo: ({ id, undo }) => change(id, undo, "geri alındı", false),
  };
}

export function useSavingIds() {
  const ids = useMutationState({
    filters: { mutationKey: bookKeys.status, status: "pending" },
    select: (m) => m.state.variables?.id,
  });

  return useMemo(() => Object.fromEntries(ids.map((id) => [id, true])), [ids]);
}
