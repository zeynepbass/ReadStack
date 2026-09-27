"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AuthLayout,
  ForgotPassword,
  Login,
  Register,
  useForgotPassword,
  useLogin,
  useLogout,
  useMe,
  useRegister,
  useResetPassword,
} from "@/features/auth";
import { BookDetail } from "@/features/book-detail";
import { Library, useBookActions, useSavingIds } from "@/features/library";
import { Profile } from "@/features/profile";
import { getErrorMessage, session, setUnauthorizedHandler } from "@/shared/apiClient";
import { Header, Toast } from "@/shared/components/organisms";
import { initials } from "@/shared/utils/books";
import { AUTH_ROUTES, parsePath, toPath } from "@/shared/utils/routes";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState("login");
  const [bookId, setBookId] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const loginMutation = useLogin();
  const { mutate: logoutMutate } = useLogout();
  const registerMutation = useRegister();
  const forgotMutation = useForgotPassword();
  const resetMutation = useResetPassword();
  const { data: me } = useMe({ enabled: Boolean(user) });

  const showToast = useCallback((next) => {
    clearTimeout(toastTimer.current);
    setToast(next);
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  }, []);

  const bookActions = useBookActions({ onToast: showToast });
  const saving = useSavingIds();

  const navigate = useCallback((nextRoute, id = null, { replace = false } = {}) => {
    setRoute(nextRoute);
    setBookId(id);
    const path = toPath(nextRoute, id);
    if (window.location.pathname !== path) {
      window.history[replace ? "replaceState" : "pushState"](null, "", path);
    }
    window.scrollTo(0, 0);
  }, []);

  const go = (nextRoute) => (e) => {
    if (e && e.preventDefault) e.preventDefault();
    [loginMutation, registerMutation, forgotMutation, resetMutation].forEach((m) => m.reset());
    navigate(nextRoute);
  };

  const openBook = useCallback((id) => navigate("detail", id), [navigate]);

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
      logoutMutate({ revoke });
      setUser(null);
      navigate("login", null, { replace: true });
      if (message) showToast({ text: message });
    },
    [logoutMutate, navigate, showToast]
  );

  useEffect(() => {
    setUnauthorizedHandler(() => logout("Oturumun sona erdi, tekrar giriş yap."));
    const savedUser = session.getUser();
    const isAuthed = Boolean(savedUser && session.get("accessToken"));

    if (isAuthed) setUser(savedUser);

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
    if (me) setUser(me);
  }, [me]);

  const completeLogin = (data) => {
    setUser(data.user);
    navigate("home", null, { replace: true });
  };

  const authError = (mutation, fallback) => (mutation.error ? getErrorMessage(mutation.error, fallback) : null);

  const handleLogin = (form) => loginMutation.mutate(form, { onSuccess: completeLogin });

  const handleRegister = (form) =>
    registerMutation.mutate(form, {
      onSuccess: () => loginMutation.mutate({ email: form.email, password: form.password }, { onSuccess: completeLogin }),
    });

  const handleForgot = (email) => forgotMutation.mutateAsync(email).catch(() => null);

  const handleReset = (form) =>
    resetMutation.mutate(form, {
      onSuccess: (data) => {
        navigate("login", null, { replace: true });
        showToast({ text: data.message });
      },
    });

  const undo = () => {
    if (toast?.undo) bookActions.undo(toast);
  };

  if (!ready) return <div className="min-h-screen bg-paper" />;

  const toastStatus = toast?.id ? (saving[toast.id] ? "kaydediliyor…" : "kaydedildi") : null;
  const authProps = {
    login: {
      error: authError(loginMutation, "Giriş yapılamadı"),
      loading: loginMutation.isPending,
    },
    register: {
      error: authError(registerMutation, "Kayıt oluşturulamadı") ?? authError(loginMutation, "Giriş yapılamadı"),
      loading: registerMutation.isPending || loginMutation.isPending,
    },
    forgot: {
      error: authError(resetMutation, "Şifre güncellenemedi") ?? authError(forgotMutation, "Sıfırlama kodu oluşturulamadı"),
      loading: forgotMutation.isPending || resetMutation.isPending,
    },
  };

  return (
    <div className="min-h-screen bg-paper">
      {!user ? (
        <AuthLayout>
          {route === "register" && <Register onSubmit={handleRegister} onLogin={go("login")} {...authProps.register} />}
          {route === "forgot" && (
            <ForgotPassword onRequest={handleForgot} onReset={handleReset} onLogin={go("login")} {...authProps.forgot} />
          )}
          {route !== "register" && route !== "forgot" && (
            <Login onSubmit={handleLogin} onRegister={go("register")} onForgot={go("forgot")} {...authProps.login} />
          )}
        </AuthLayout>
      ) : (
        <>
          <Header route={route} userInitials={initials(user.name)} onHome={go("home")} onProfile={go("profile")} />

          {route === "home" && <Library onOpen={openBook} onToast={showToast} />}

          {route === "detail" && <BookDetail key={bookId} bookId={bookId} onBack={go("home")} onToast={showToast} />}

          {route === "profile" && <Profile onOpen={openBook} onLogout={() => logout(null, { revoke: true })} />}
        </>
      )}

      {toast && <Toast text={toast.text} status={toastStatus} onUndo={toast.undo && !saving[toast.id] ? undo : null} />}
    </div>
  );
}
