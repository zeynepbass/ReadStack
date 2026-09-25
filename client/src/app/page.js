"use client";

import { useRef, useState } from "react";
import { AuthLayout, Login, Register } from "@/features/auth";
import { BookDetail } from "@/features/book-detail";
import { Library } from "@/features/library";
import { Profile } from "@/features/profile";
import { Header, Toast } from "@/shared/components/organisms";
import seedBooks from "@/shared/mocks/books.json";
import { GROUPS, PATHS, SHELF_FILTERS, TODAY, compareBooks, decorateBook } from "@/shared/utils/books";

export default function Home() {
  const [route, setRoute] = useState("home");
  const [bookId, setBookId] = useState(1);
  const [q, setQ] = useState("");
  const [prio, setPrio] = useState("all");
  const [author, setAuthor] = useState("all");
  const [tab, setTab] = useState("pending");
  const [view, setView] = useState("kart");
  const [books, setBooks] = useState(seedBooks);
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [ptab, setPtab] = useState("okundu");
  const toastTimer = useRef(null);

  const navigate = (nextRoute, id) => {
    setRoute(nextRoute);
    if (id) setBookId(id);
    window.scrollTo(0, 0);
  };

  const go = (nextRoute) => (e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigate(nextRoute);
  };

  const act = (id, status, msg) => {
    const prev = books.find((b) => b.id === id);
    const snapshot = { status: prev.status, progress: prev.progress, history: prev.history };
    const kind = status === "okundu" ? "done" : status === "birakildi" ? "drop" : "add";
    const text = status === "okundu" ? "Okundu olarak işaretlendi" : status === "birakildi" ? "Yarıda bırakıldı" : "Listeye geri alındı";

    setBooks((list) =>
      list.map((b) =>
        b.id === id
          ? { ...b, status, progress: status === "okundu" ? b.pages : b.progress, history: [{ date: TODAY, text, kind }, ...b.history] }
          : b
      )
    );
    setSaving((s) => ({ ...s, [id]: true }));
    setToast({ text: `“${prev.title}” ${msg}`, id, snapshot });
    setTimeout(() => setSaving((s) => ({ ...s, [id]: false })), 700);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  };

  const actions = {
    onOpen: (id) => navigate("detail", id),
    onFinish: (id) => act(id, "okundu", "okundu olarak işaretlendi"),
    onDrop: (id) => act(id, "birakildi", "bırakıldı"),
    onRestore: (id) => {
      const b = books.find((x) => x.id === id);
      act(id, b.progress > 0 && b.progress < b.pages ? "okunuyor" : "okunacak", "listeye geri alındı");
    },
  };

  const undo = () => {
    if (!toast) return;
    clearTimeout(toastTimer.current);
    const t = toast;
    setToast(null);
    setBooks((list) => list.map((b) => (b.id === t.id ? { ...b, ...t.snapshot } : b)));
  };

  const setProgress = (value) => {
    setBooks((list) =>
      list.map((b) =>
        b.id === bookId
          ? { ...b, progress: value, status: b.status === "okunacak" && value > 0 ? "okunuyor" : b.status }
          : b
      )
    );
  };

  const addNote = () => {
    const text = noteDraft.trim();
    if (!text) return;
    setNoteDraft("");
    setBooks((list) =>
      list.map((b) =>
        b.id === bookId ? { ...b, notes: [...b.notes, { page: "s. " + b.progress, date: "24 Eyl", text }] } : b
      )
    );
  };

  const clearFilters = () => {
    setQ("");
    setPrio("all");
    setAuthor("all");
  };

  const query = q.trim().toLocaleLowerCase("tr");
  const list = books
    .filter(GROUPS[tab])
    .filter((b) => prio === "all" || b.priority === prio)
    .filter((b) => author === "all" || b.author === author)
    .filter((b) => !query || (b.title + " " + b.author).toLocaleLowerCase("tr").includes(query))
    .sort(compareBooks)
    .map((b) => decorateBook(b, saving));

  const homeTabs = [
    { key: "pending", label: "Bekleyen", count: books.filter(GROUPS.pending).length },
    { key: "done", label: "Okunan", count: books.filter(GROUPS.done).length },
    { key: "dropped", label: "Bırakılan", count: books.filter(GROUPS.dropped).length },
  ];

  const profileTabs = [
    { key: "okundu", label: "Okuduklarım" },
    { key: "okunuyor", label: "Okuyorum" },
    { key: "tumu", label: "Tüm kitaplar" },
  ].map((t) => ({ ...t, count: books.filter(SHELF_FILTERS[t.key]).length }));

  const isAuthPage = route === "login" || route === "register";
  const routePath = route === "detail" ? `/book/${bookId}` : PATHS[route];

  return (
    <div className="min-h-screen bg-paper">
      {isAuthPage ? (
        <AuthLayout routePath={routePath}>
          {route === "login" ? (
            <Login onSubmit={go("home")} onRegister={go("register")} />
          ) : (
            <Register onSubmit={go("home")} onLogin={go("login")} />
          )}
        </AuthLayout>
      ) : (
        <>
          <Header route={route} routePath={routePath} onHome={go("home")} onProfile={go("profile")} />

          {route === "home" && (
            <Library
              books={list}
              pendingCount={homeTabs[0].count}
              tabs={homeTabs}
              tab={tab}
              onTabChange={setTab}
              filters={{
                q,
                onSearch: setQ,
                prio,
                onPrioChange: setPrio,
                author,
                authors: [...new Set(books.map((b) => b.author))].sort((a, b) => a.localeCompare(b, "tr")),
                onAuthorChange: setAuthor,
                onViewChange: setView,
              }}
              view={view}
              onClearFilters={clearFilters}
              actions={actions}
            />
          )}

          {route === "detail" && (
            <BookDetail
              book={decorateBook(books.find((b) => b.id === bookId) || books[0], saving)}
              onBack={go("home")}
              actions={actions}
              onProgressChange={setProgress}
              noteDraft={noteDraft}
              onNoteChange={setNoteDraft}
              onAddNote={addNote}
            />
          )}

          {route === "profile" && (
            <Profile
              readCount={books.filter(GROUPS.done).length}
              readingCount={books.filter((b) => b.status === "okunuyor").length}
              pagesRead={books.reduce((n, b) => n + (b.status === "birakildi" ? 0 : b.progress), 0)}
              tabs={profileTabs}
              tab={ptab}
              onTabChange={setPtab}
              shelf={books.filter(SHELF_FILTERS[ptab]).map((b) => decorateBook(b, saving))}
              onOpen={actions.onOpen}
              onLogout={go("login")}
            />
          )}
        </>
      )}

      {toast && <Toast text={toast.text} saving={saving[toast.id]} onUndo={undo} />}
    </div>
  );
}
