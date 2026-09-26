export const AUTH_ROUTES = ["login", "register", "forgot"];

const STATIC_PATHS = {
  login: "/login",
  register: "/register",
  forgot: "/forgot-password",
  home: "/",
  profile: "/profile",
};

export function toPath(route, id) {
  if (route === "detail") return `/book/${encodeURIComponent(id)}`;
  return STATIC_PATHS[route] ?? "/";
}

export function parsePath(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const detail = clean.match(/^\/book\/([^/]+)$/);
  if (detail) return { route: "detail", id: decodeURIComponent(detail[1]) };
  const entry = Object.entries(STATIC_PATHS).find(([, path]) => path === clean);
  return { route: entry ? entry[0] : "home", id: null };
}
