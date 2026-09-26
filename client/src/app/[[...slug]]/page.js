"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthLayout, ForgotPassword, Login, Register } from "@/features/auth";
import { BookDetail, BookDetailStatus } from "@/features/book-detail";
import { Library } from "@/features/library";
import { Profile } from "@/features/profile";
import api, { getErrorMessage, session, setUnauthorizedHandler } from "@/shared/apiClient";
import { Header, Toast } from "@/shared/components/organisms";
import {
  GROUPS,
  PRIORITY_TO_API,
  READING_GOAL,
  SHELF_FILTERS,
  STATUS_ACTIONS,
  compareBooks,
  decorateBook,
  fromApi,
  greeting,
  initials,
} from "@/shared/utils/books";
import { AUTH_ROUTES, parsePath, toPath } from "@/shared/utils/routes";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState("login");
  const [bookId, setBookId] = useState(null);
  const [prs, setPrs] = useState([]);
  const [listState, setListState] = useState({ loading: false, error: null });
  const [detailState, setDetailState] = useState({ loading: false, error: null });
  const [visibleIds, setVisibleIds] = useState(null);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [prio, setPrio] = useState("all");
  const [author, setAuthor] = useState("all");
  const [tab, setTab] = useState("pending");
  const [view, setView] = useState("kart");
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [ptab, setPtab] = useState("okundu");
  const [authState, setAuthState] = useState({ loading: false, error: null });
  const [addForm, setAddForm] = useState({ open: false, loading: false, error: null });
  const [noteSaving, setNoteSaving] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const toastTimer = useRef(null);
  const progressTimers = useRef({});

  const showToast = useCallback((next) => {
    clearTimeout(toastTimer.current);
    setToast(next);
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  }, []);

  const navigate = useCallback((nextRoute, id = null, { replace = false } = {}) => {
    setRoute(nextRoute);
    setBookId(id);
    setNoteDraft("");
    const path = toPath(nextRoute, id);
    if (window.location.pathname !== path) {
      window.history[replace ? "replaceState" : "pushState"](null, "", path);
    }
    window.scrollTo(0, 0);
  }, []);

  const go = (nextRoute) => (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setAuthState({ loading: false, error: null });
    navigate(nextRoute);
  };

  const resolveRoute = useCallback(
    (pathname, isAuthed) => {
      const { route: target, id } = parsePath(pathname);
      if (isAuthed && AUTH_ROUTES.includes(target)) return navigate("home", null, { replace: true });
      if (!isAuthed && !AUTH_ROUTES.includes(target)) return navigate("login", null, { replace: true });
      navigate(target, id, { replace: true });
    },
    [navigate]
  );

  const logout = useCallback(
    (message, { revoke = false } = {}) => {
      const refreshToken = session.get("refreshToken");
      if (revoke && refreshToken) api.post("/auth/logout", { refreshToken }).catch(() => {});
      session.clear();
      setUser(null);
      setPrs([]);
      setVisibleIds(null);
      navigate("login", null, { replace: true });
      if (message) showToast({ text: message });
    },
    [navigate, showToast]
  );

  const upsert = useCallback((docs) => {
    setPrs((list) => {
      const map = new Map(list.map((p) => [p._id, p]));
      docs.forEach((doc) => map.set(doc._id, doc));
      return [...map.values()];
    });
  }, []);

  const loadBooks = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setListState({ loading: true, error: null });
    try {
      const { data } = await api.get("/prs");
      setPrs(data);
      setListState({ loading: false, error: null });
    } catch (err) {
      setListState({ loading: false, error: getErrorMessage(err, "Kitaplar yüklenemedi") });
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => logout("Oturumun sona erdi, tekrar giriş yap."));
    const savedUser = session.getUser();
    const isAuthed = Boolean(savedUser && session.get("accessToken"));

    if (isAuthed) {
      setUser(savedUser);
      api
        .get("/auth/me")
        .then(({ data }) => {
          session.setUser(data.user);
          setUser(data.user);
        })
        .catch(() => {});
    }

    resolveRoute(window.location.pathname, isAuthed);
    setReady(true);

    const onPopState = () => resolveRoute(window.location.pathname, Boolean(session.get("accessToken")));
    window.addEventListener("popstate", onPopState);

    return () => {
      setUnauthorizedHandler(null);
      window.removeEventListener("popstate", onPopState);
    };
  }, [logout, resolveRoute]);

  useEffect(() => {
    if (user) loadBooks();
  }, [user, loadBooks]);

  useEffect(() => {
    if (user) return;
    let cancelled = false;
    api
      .get("/stats/monthly")
      .then(({ data }) => !cancelled && setMonthlyStats(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(q.trim()), 300);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    if (!user) return;
    if (!search && prio === "all") {
      setVisibleIds(null);
      return;
    }

    let cancelled = false;
    const params = {
      ...(search && { search }),
      ...(prio !== "all" && { priority: PRIORITY_TO_API[prio] }),
    };

    api
      .get("/prs", { params })
      .then(({ data }) => {
        if (cancelled) return;
        upsert(data);
        setVisibleIds(new Set(data.map((doc) => doc._id)));
      })
      .catch((err) => {
        if (!cancelled) showToast({ text: getErrorMessage(err, "Arama yapılamadı") });
      });

    return () => {
      cancelled = true;
    };
  }, [user, search, prio, upsert, showToast]);

  useEffect(() => {
    if (!user || route !== "detail" || !bookId) return;
    let cancelled = false;
    setDetailState({ loading: true, error: null });
    api
      .get(`/prs/${bookId}`)
      .then(({ data }) => {
        if (cancelled) return;
        upsert([data]);
        setDetailState({ loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setDetailState({ loading: false, error: getErrorMessage(err, "Kitap bulunamadı") });
      });
    return () => {
      cancelled = true;
    };
  }, [user, route, bookId, upsert]);

  const books = useMemo(() => prs.map(fromApi), [prs]);
  const goal = user?.readingGoal ?? READING_GOAL;

  const completeLogin = async ({ email, password, remember = true }) => {
    const { data } = await api.post("/auth/login", { email, password });
    session.save(data, remember);
    setUser(data.user);
    navigate("home", null, { replace: true });
  };

  const runAuth = async (action, fallback) => {
    setAuthState({ loading: true, error: null });
    try {
      const result = await action();
      setAuthState({ loading: false, error: null });
      return result ?? true;
    } catch (err) {
      setAuthState({ loading: false, error: getErrorMessage(err, fallback) });
      return null;
    }
  };

  const handleLogin = (form) => runAuth(() => completeLogin(form), "Giriş yapılamadı");

  const handleRegister = ({ name, email, password, goal: readingGoal }) =>
    runAuth(async () => {
      await api.post("/auth/register", { name, email, password, readingGoal });
      await completeLogin({ email, password });
    }, "Kayıt oluşturulamadı");

  const handleForgot = (email) =>
    runAuth(async () => (await api.post("/auth/forgot-password", { email })).data, "Sıfırlama kodu oluşturulamadı");

  const handleReset = async ({ token, password }) => {
    const done = await runAuth(async () => (await api.post("/auth/reset-password", { token, password })).data, "Şifre güncellenemedi");
    if (!done) return;
    navigate("login", null, { replace: true });
    showToast({ text: done.message });
  };

  const changeStatus = async (id, nextStatus, message, undoable = true) => {
    const current = prs.find((p) => p._id === id);
    if (!current || saving[id] || current.status === nextStatus) return;

    setSaving((s) => ({ ...s, [id]: true }));
    setPrs((list) => list.map((p) => (p._id === id ? { ...p, status: nextStatus } : p)));
    showToast({ text: `“${current.title}” ${message}`, id, undo: undoable ? current.status : null });

    try {
      const { data } = await api.patch(`/prs/${id}/${STATUS_ACTIONS[nextStatus]}`, { version: current.version });
      upsert([data]);
    } catch (err) {
      setPrs((list) => list.map((p) => (p._id === id ? current : p)));
      showToast({ text: getErrorMessage(err, "Değişiklik kaydedilemedi") });
      if (err.response?.status === 409) loadBooks({ silent: true });
    } finally {
      setSaving((s) => ({ ...s, [id]: false }));
    }
  };

  const actions = {
    onOpen: (id) => navigate("detail", id),
    onFinish: (id) => changeStatus(id, "approved", "okundu olarak işaretlendi"),
    onDrop: (id) => changeStatus(id, "rejected", "bırakıldı"),
    onRestore: (id) => changeStatus(id, "pending", "listeye geri alındı"),
  };

  const undo = () => {
    if (!toast?.undo) return;
    const { id, undo: previousStatus } = toast;
    changeStatus(id, previousStatus, "geri alındı", false);
  };

  const handleAddBook = async ({ title, author: bookAuthor, pages, priority, genre, year, description }) => {
    setAddForm((f) => ({ ...f, loading: true, error: null }));
    try {
      const { data } = await api.post("/prs", {
        title,
        author: bookAuthor,
        fileCount: pages,
        priority: PRIORITY_TO_API[priority],
        genre,
        year,
        description,
      });
      upsert([data]);
      setAddForm({ open: false, loading: false, error: null });
      setTab("pending");
      showToast({ text: `“${data.title}” listeye eklendi` });
    } catch (err) {
      setAddForm((f) => ({ ...f, loading: false, error: getErrorMessage(err, "Kitap eklenemedi") }));
    }
  };

  const setProgress = (value) => {
    const id = bookId;
    setPrs((list) => list.map((p) => (p._id === id ? { ...p, progress: value } : p)));
    clearTimeout(progressTimers.current[id]);
    progressTimers.current[id] = setTimeout(async () => {
      try {
        const { data } = await api.patch(`/prs/${id}/progress`, { progress: value });
        upsert([data]);
      } catch (err) {
        showToast({ text: getErrorMessage(err, "İlerleme kaydedilemedi") });
        loadBooks({ silent: true });
      }
    }, 400);
  };

  const addNote = async () => {
    const text = noteDraft.trim();
    if (!text || noteSaving) return;
    const id = bookId;
    const book = books.find((b) => b.id === id);
    setNoteSaving(true);
    try {
      const { data } = await api.post(`/prs/${id}/notes`, { text, page: book?.progress ?? 0 });
      upsert([data]);
      setNoteDraft("");
    } catch (err) {
      showToast({ text: getErrorMessage(err, "Not eklenemedi") });
    } finally {
      setNoteSaving(false);
    }
  };

  const clearFilters = () => {
    setQ("");
    setSearch("");
    setPrio("all");
    setAuthor("all");
  };

  if (!ready) return <div className="min-h-screen bg-paper" />;

  const list = books
    .filter(GROUPS[tab])
    .filter((b) => !visibleIds || visibleIds.has(b.id))
    .filter((b) => author === "all" || b.author === author)
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

  const currentYear = new Date().getFullYear();
  const detailBook = books.find((b) => b.id === bookId);
  const userView = user && { name: user.name, email: user.email, initials: initials(user.name) };
  const toastStatus = toast?.id ? (saving[toast.id] ? "kaydediliyor…" : "kaydedildi") : null;
  const authProps = { error: authState.error, loading: authState.loading };

  return (
    <div className="min-h-screen bg-paper">
      {!user ? (
        <AuthLayout stats={monthlyStats}>
          {route === "register" && <Register onSubmit={handleRegister} onLogin={go("login")} {...authProps} />}
          {route === "forgot" && (
            <ForgotPassword onRequest={handleForgot} onReset={handleReset} onLogin={go("login")} {...authProps} />
          )}
          {route !== "register" && route !== "forgot" && (
            <Login onSubmit={handleLogin} onRegister={go("register")} onForgot={go("forgot")} {...authProps} />
          )}
        </AuthLayout>
      ) : (
        <>
          <Header route={route} userInitials={userView.initials} onHome={go("home")} onProfile={go("profile")} />

          {route === "home" && (
            <Library
              books={list}
              greeting={`${greeting()}, ${user.name.split(" ")[0]}`}
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
              loading={listState.loading}
              error={listState.error}
              onRetry={() => loadBooks()}
              addForm={{
                ...addForm,
                onOpen: () => setAddForm({ open: true, loading: false, error: null }),
                onClose: () => setAddForm({ open: false, loading: false, error: null }),
                onSubmit: handleAddBook,
              }}
            />
          )}

          {route === "detail" && detailBook && (
            <BookDetail
              book={decorateBook(detailBook, saving)}
              onBack={go("home")}
              actions={actions}
              onProgressChange={setProgress}
              noteDraft={noteDraft}
              onNoteChange={setNoteDraft}
              onAddNote={addNote}
              noteSaving={noteSaving}
            />
          )}

          {route === "detail" && !detailBook && (
            <BookDetailStatus title={detailState.error || "Kitap yükleniyor…"} onBack={go("home")} />
          )}

          {route === "profile" && (
            <Profile
              user={userView}
              goal={goal}
              readCount={books.filter((b) => b.status === "okundu" && b.finishedYear === currentYear).length}
              readingCount={books.filter((b) => b.status === "okunuyor").length}
              pagesRead={books.reduce((n, b) => n + (b.status === "birakildi" ? 0 : b.progress), 0)}
              tabs={profileTabs}
              tab={ptab}
              onTabChange={setPtab}
              shelf={books.filter(SHELF_FILTERS[ptab]).map((b) => decorateBook(b, saving))}
              onOpen={actions.onOpen}
              onLogout={() => logout(null, { revoke: true })}
            />
          )}
        </>
      )}

      {toast && <Toast text={toast.text} status={toastStatus} onUndo={toast.undo && !saving[toast.id] ? undo : null} />}
    </div>
  );
}
