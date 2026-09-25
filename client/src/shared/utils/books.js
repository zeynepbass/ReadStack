export const TODAY = "24 Eyl 2026";
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

export const PATHS = {
  login: "/login",
  register: "/register",
  home: "/",
  profile: "/profile",
};

export function compareBooks(a, b) {
  return (
    (STATUS_ORDER[a.status] ?? 2) - (STATUS_ORDER[b.status] ?? 2) ||
    PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}

export function decorateBook(b, saving) {
  const pct = Math.round((b.progress / b.pages) * 100);
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
