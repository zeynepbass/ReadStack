export const READING_GOAL = 24;

export const PRIORITIES = {
  yuksek: ["Yüksek", "oklch(0.58 0.15 35)"],
  orta: ["Orta", "oklch(0.72 0.13 80)"],
  dusuk: ["Düşük", "oklch(0.65 0.06 240)"],
};

export const PRIORITY_CHIPS = [
  ["all", "Tümü", "#c9c0b2"],
  ["yuksek", ...PRIORITIES.yuksek],
  ["orta", ...PRIORITIES.orta],
  ["dusuk", ...PRIORITIES.dusuk],
];

export const PRIORITY_TO_API = { yuksek: "high", orta: "medium", dusuk: "low" };
const PRIORITY_FROM_API = { high: "yuksek", medium: "orta", low: "dusuk" };

export const STATUS_ACTIONS = { pending: "reopen", approved: "approve", rejected: "reject" };

const STATUS_LABELS = {
  okunacak: "Okunacak",
  okunuyor: "Okunuyor",
  okundu: "Okundu",
  birakildi: "Bırakıldı",
};

const HISTORY_COLORS = {
  done: "oklch(0.48 0.09 150)",
  drop: "oklch(0.55 0.13 30)",
  start: "#1f1c18",
  add: "#c9c0b2",
  reopen: "#c9c0b2",
};

const HISTORY_TEXT = {
  add: "Listeye eklendi",
  start: "Okumaya başlandı",
  done: "Okundu olarak işaretlendi",
  drop: "Yarıda bırakıldı",
  reopen: "Listeye geri alındı",
};

const PRIORITY_ORDER = { yuksek: 0, orta: 1, dusuk: 2 };
const STATUS_ORDER = { okunuyor: 0, okunacak: 1 };

export const GROUPS = {
  pending: (b) => b.status === "okunacak" || b.status === "okunuyor",
  done: (b) => b.status === "okundu",
  dropped: (b) => b.status === "birakildi",
};

export const SHELF_FILTERS = {
  okundu: (b) => b.status === "okundu",
  okunuyor: (b) => b.status === "okunuyor",
  tumu: () => true,
};

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

function hueFromId(id) {
  return [...String(id)].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 360, 7);
}

export function fromApi(pr) {
  const pages = pr.fileCount || 0;
  const progress = pr.status === "approved" ? pages : Math.min(pr.progress ?? 0, pages);
  const status =
    pr.status === "approved" ? "okundu" : pr.status === "rejected" ? "birakildi" : progress > 0 ? "okunuyor" : "okunacak";
  const history = pr.history?.length ? pr.history : [{ kind: "add", createdAt: pr.createdAt }];
  const finished = pr.status === "approved" ? [...history].reverse().find((h) => h.kind === "done") : null;

  return {
    id: pr._id,
    version: pr.version,
    title: pr.title,
    author: pr.author,
    pages,
    priority: PRIORITY_FROM_API[pr.priority] ?? "orta",
    status,
    progress,
    genre: pr.genre,
    year: pr.year,
    desc: pr.description,
    hue: hueFromId(pr._id),
    finishedYear: finished ? new Date(finished.createdAt ?? pr.updatedAt).getFullYear() : null,
    notes: (pr.notes ?? []).map((n) => ({
      id: n._id,
      page: n.page != null ? `s. ${n.page}` : "",
      date: formatDate(n.createdAt),
      text: n.text,
    })),
    history: [...history].reverse().map((h) => ({ date: formatDate(h.createdAt), text: HISTORY_TEXT[h.kind], kind: h.kind })),
  };
}

export function compareBooks(a, b) {
  return (
    (STATUS_ORDER[a.status] ?? 2) - (STATUS_ORDER[b.status] ?? 2) ||
    PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}

export function decorateBook(b, saving) {
  const pct = b.pages ? Math.round((b.progress / b.pages) * 100) : 0;
  const parts = b.author.split(" ");
  return {
    ...b,
    cover: `oklch(0.42 0.075 ${b.hue})`,
    authorShort: parts[parts.length - 1],
    prioLabel: PRIORITIES[b.priority][0],
    prioColor: PRIORITIES[b.priority][1],
    statusLabel: STATUS_LABELS[b.status],
    pct: pct + "%",
    progressText: `${b.progress} / ${b.pages} s. · %${pct}`,
    hours: Math.round(b.pages / 45),
    isSaving: Boolean(saving[b.id]),
    isPending: b.status === "okunacak" || b.status === "okunuyor",
    isClosed: b.status === "okundu" || b.status === "birakildi",
    closedText: b.status === "okundu" ? "✓ " + b.history[0].date + " bitirildi" : "Yarıda bırakıldı",
    history: b.history.map((h) => ({ ...h, color: HISTORY_COLORS[h.kind] })),
  };
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase("tr"))
    .join("");
}

export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Günaydın";
  if (hour < 18) return "İyi günler";
  return "İyi akşamlar";
}
