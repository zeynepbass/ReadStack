import { useMemo } from "react";
import { useMe } from "@/features/auth";
import { useBooks, useSavingIds } from "@/features/library";
import { usePersistentState } from "@/shared/hooks/usePersistentState";
import { READING_GOAL, SHELF_FILTERS, decorateBook, fromApi, initials } from "@/shared/utils/books";

const PROFILE_TABS = [
  { key: "okundu", label: "Okuduklarım" },
  { key: "okunuyor", label: "Okuyorum" },
  { key: "tumu", label: "Tüm kitaplar" },
];

export function useProfile() {
  const { data: user } = useMe();
  const { data } = useBooks();
  const saving = useSavingIds();
  const [tab, setTab] = usePersistentState("profile.tab", "okundu");

  const books = useMemo(() => (data ?? []).map(fromApi), [data]);
  const currentYear = new Date().getFullYear();

  return {
    user: { name: user?.name ?? "", email: user?.email ?? "", initials: initials(user?.name) },
    goal: user?.readingGoal ?? READING_GOAL,
    readCount: books.filter((b) => b.status === "okundu" && b.finishedYear === currentYear).length,
    readingCount: books.filter((b) => b.status === "okunuyor").length,
    pagesRead: books.reduce((n, b) => n + (b.status === "birakildi" ? 0 : b.progress), 0),
    tabs: PROFILE_TABS.map((t) => ({ ...t, count: books.filter(SHELF_FILTERS[t.key]).length })),
    tab,
    onTabChange: setTab,
    shelf: books.filter(SHELF_FILTERS[tab]).map((b) => decorateBook(b, saving)),
  };
}
