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

function makeBook(id, title, author, pages, year, genre, priority, status, progress, hue, desc, notes = []) {
  return {
    id,
    title,
    author,
    pages,
    year,
    genre,
    priority,
    status,
    progress,
    hue,
    desc,
    notes,
    history: [
      ...(status === "okundu" ? [{ date: "2 Eyl 2026", text: "Okundu olarak işaretlendi", kind: "done" }] : []),
      ...(status === "birakildi" ? [{ date: "28 Ağu 2026", text: "Yarıda bırakıldı", kind: "drop" }] : []),
      ...(progress > 0 ? [{ date: "14 Ağu 2026", text: "Okumaya başlandı", kind: "start" }] : []),
      { date: "3 Ağu 2026", text: "Listeye eklendi", kind: "add" },
    ],
  };
}

export const SEED_BOOKS = [
  makeBook(1, "Kürk Mantolu Madonna", "Sabahattin Ali", 160, 1943, "Roman", "yuksek", "okunuyor", 96, 40, "Berlin’de bir sergide karşılaştığı portre, sessiz bir memurun iç dünyasını baştan aşağı değiştirir. Aşk, yalnızlık ve söylenemeyenler üzerine kısa ama derin bir roman.", [{ page: "s. 42", date: "18 Eyl", text: "Raif Efendi’nin sessizliği aslında bir tür çığlık." }]),
  makeBook(2, "Tutunamayanlar", "Oğuz Atay", 724, 1972, "Roman", "yuksek", "okunacak", 0, 250, "Bir arkadaşının intiharının ardından onun defterlerini okuyan Turgut, kendi hayatını da sorgulamaya başlar. Türk edebiyatının biçim açısından en cesur romanlarından biri."),
  makeBook(3, "Saatleri Ayarlama Enstitüsü", "Ahmet Hamdi Tanpınar", 382, 1961, "Roman", "orta", "okunuyor", 140, 80, "Hayri İrdal’ın gözünden, saatleri ayarlamak için kurulan absürt bir kurum üzerinden modernleşme ve bürokrasi hicvi."),
  makeBook(4, "Yüzyıllık Yalnızlık", "Gabriel García Márquez", 464, 1967, "Roman", "orta", "okunacak", 0, 150, "Buendía ailesinin yedi kuşağı ve hayali Macondo kasabası; büyülü gerçekçiliğin kurucu metinlerinden."),
  makeBook(5, "Sapiens", "Yuval Noah Harari", 512, 2011, "Tarih", "dusuk", "okunacak", 0, 60, "İnsan türünün avcı-toplayıcılıktan günümüze uzanan hikâyesi; bilişsel, tarım ve bilim devrimleri ekseninde."),
  makeBook(6, "Suç ve Ceza", "Fyodor Dostoyevski", 687, 1866, "Klasik", "orta", "okundu", 687, 20, "Yoksul bir öğrenci olan Raskolnikov’un işlediği cinayetin ardından yaşadığı vicdan muhasebesi.", [{ page: "s. 311", date: "28 Ağu", text: "Sonya ile İncil okuma sahnesi kitabın kalbi." }]),
  makeBook(7, "Beyaz Kale", "Orhan Pamuk", 184, 1985, "Roman", "dusuk", "okundu", 184, 220, "17. yüzyıl İstanbul’unda bir Venedikli köle ile ona tıpatıp benzeyen efendisi arasındaki kimlik oyunu."),
  makeBook(8, "Körlük", "José Saramago", 336, 1995, "Roman", "yuksek", "okunacak", 0, 300, "Adsız bir şehirde yayılan beyaz körlük salgını, toplumsal düzenin ne kadar kırılgan olduğunu gösterir."),
  makeBook(9, "Dune", "Frank Herbert", 712, 1965, "Bilimkurgu", "orta", "okunacak", 0, 60, "Çöl gezegeni Arrakis’te baharat, iktidar ve kehanet üzerine kurulu epik bir bilimkurgu."),
  makeBook(10, "İnce Memed", "Yaşar Kemal", 436, 1955, "Roman", "dusuk", "birakildi", 120, 110, "Çukurova’da ağaya başkaldıran genç Memed’in eşkıyalığa uzanan hikâyesi."),
  makeBook(11, "Martin Eden", "Jack London", 480, 1909, "Roman", "orta", "okundu", 480, 190, "Yazar olmaya karar veren genç bir denizcinin, sınıf ve başarı üzerine acı dersleri."),
  makeBook(12, "Dönüşüm", "Franz Kafka", 96, 1915, "Klasik", "yuksek", "okundu", 96, 340, "Bir sabah dev bir böceğe dönüşerek uyanan Gregor Samsa ve ailesinin ona tavrı."),
];

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
