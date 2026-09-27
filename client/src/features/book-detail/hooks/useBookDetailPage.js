import { useState } from "react";
import { useBookActions, useSavingIds } from "@/features/library";
import { getErrorMessage } from "@/shared/apiClient";
import { decorateBook, fromApi } from "@/shared/utils/books";
import { useBookDetail } from "./useBookDetail";
import { useAddNote } from "./useNotes";
import { useUpdateProgress } from "./useProgress";

export function useBookDetailPage({ bookId, onToast }) {
  const detailQuery = useBookDetail(bookId);
  const saving = useSavingIds();
  const { onFinish, onDrop, onRestore } = useBookActions({ onToast });
  const setProgress = useUpdateProgress({
    onError: (err) => onToast({ text: getErrorMessage(err, "İlerleme kaydedilemedi") }),
  });
  const noteMutation = useAddNote();
  const [noteDraft, setNoteDraft] = useState("");

  const doc = detailQuery.data;
  const book = doc ? decorateBook(fromApi(doc), saving) : null;

  const addNote = () => {
    const text = noteDraft.trim();
    if (!text || !book || noteMutation.isPending) return;
    noteMutation.mutate(
      { id: bookId, text, page: book.progress },
      {
        onSuccess: () => setNoteDraft(""),
        onError: (err) => onToast({ text: getErrorMessage(err, "Not eklenemedi") }),
      }
    );
  };

  return {
    book,
    statusTitle: detailQuery.error ? getErrorMessage(detailQuery.error, "Kitap bulunamadı") : "Kitap yükleniyor…",
    actions: { onFinish, onDrop, onRestore },
    onProgressChange: (value) => setProgress(bookId, value),
    noteDraft,
    onNoteChange: setNoteDraft,
    onAddNote: addNote,
    noteSaving: noteMutation.isPending,
  };
}
