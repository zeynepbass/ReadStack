import { useEffect, useMemo, useState } from "react";
import { useMe } from "@/features/auth";
import { getErrorMessage } from "@/shared/apiClient";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { usePersistentState } from "@/shared/hooks/usePersistentState";
import { GROUPS, compareBooks, decorateBook, fromApi, greeting } from "@/shared/utils/books";
import { useAddBook } from "./useAddBook";
import { useBookActions, useSavingIds } from "./useBookActions";
import { useBookSearch, useBooks } from "./useBooks";

const SEARCH_DELAY = 600;

export function useLibrary({ onOpen, onToast }) {
  const { data: user } = useMe();
  const booksQuery = useBooks();
  const saving = useSavingIds();
  const { onFinish, onDrop, onRestore } = useBookActions({ onToast });
  const addBook = useAddBook();

  const [q, setQ] = usePersistentState("library.q", "");
  const [prio, setPrio] = usePersistentState("library.prio", "all");
  const [author, setAuthor] = usePersistentState("library.author", "all");
  const [tab, setTab] = usePersistentState("library.tab", "pending");
  const [view, setView] = usePersistentState("library.view", "kart");
  const [addOpen, setAddOpen] = useState(false);

  const debouncedQ = useDebouncedValue(q.trim(), SEARCH_DELAY);
  const search = q.trim() ? debouncedQ : "";

  const { ids: visibleIds, error: searchError } = useBookSearch({ search, prio });

  useEffect(() => {
    if (searchError) onToast({ text: getErrorMessage(searchError, "Arama yapılamadı") });
  }, [searchError, onToast]);

  const books = useMemo(() => (booksQuery.data ?? []).map(fromApi), [booksQuery.data]);

  const list = books
    .filter(GROUPS[tab])
    .filter((b) => !visibleIds || visibleIds.has(b.id))
    .filter((b) => author === "all" || b.author === author)
    .sort(compareBooks)
    .map((b) => decorateBook(b, saving));

  const tabs = [
    { key: "pending", label: "Bekleyen", count: books.filter(GROUPS.pending).length },
    { key: "done", label: "Okunan", count: books.filter(GROUPS.done).length },
    { key: "dropped", label: "Bırakılan", count: books.filter(GROUPS.dropped).length },
  ];

  const clearFilters = () => {
    setQ("");
    setPrio("all");
    setAuthor("all");
  };

  const toggleAddForm = (open) => {
    addBook.reset();
    setAddOpen(open);
  };

  const submitBook = (form) =>
    addBook.mutate(form, {
      onSuccess: (doc) => {
        setAddOpen(false);
        setTab("pending");
        onToast({ text: `“${doc.title}” listeye eklendi` });
      },
    });

  return {
    books: list,
    greeting: `${greeting()}, ${user?.name?.split(" ")[0] ?? ""}`,
    pendingCount: tabs[0].count,
    tabs,
    tab,
    onTabChange: setTab,
    filters: {
      q,
      onSearch: setQ,
      prio,
      onPrioChange: setPrio,
      author,
      authors: [...new Set(books.map((b) => b.author))].sort((a, b) => a.localeCompare(b, "tr")),
      onAuthorChange: setAuthor,
      onViewChange: setView,
    },
    view,
    onClearFilters: clearFilters,
    actions: { onOpen, onFinish, onDrop, onRestore },
    loading: booksQuery.isPending,
    error: booksQuery.isError && !booksQuery.data ? getErrorMessage(booksQuery.error, "Kitaplar yüklenemedi") : null,
    onRetry: () => booksQuery.refetch(),
    addForm: {
      open: addOpen,
      loading: addBook.isPending,
      error: addBook.error ? getErrorMessage(addBook.error, "Kitap eklenemedi") : null,
      onOpen: () => toggleAddForm(true),
      onClose: () => toggleAddForm(false),
      onSubmit: submitBook,
    },
  };
}
