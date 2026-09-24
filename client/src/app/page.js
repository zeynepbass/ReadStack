"use client";

import { useRef, useState } from "react";

const TODAY = "24 Eyl 2026";
const READING_GOAL = 24;

const PRIORITIES = {
  yuksek: ["Yüksek", "oklch(0.58 0.15 35)"],
  orta: ["Orta", "oklch(0.72 0.13 80)"],
  dusuk: ["Düşük", "oklch(0.65 0.06 240)"],
};

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

const GROUPS = {
  pending: (b) => b.status === "okunacak" || b.status === "okunuyor",
  done: (b) => b.status === "okundu",
  dropped: (b) => b.status === "birakildi",
};

const SHELF_FILTERS = {
  okundu: (b) => b.status === "okundu",
  okunuyor: (b) => b.status === "okunuyor",
  tumu: () => true,
};

const PRIORITY_CHIPS = [
  ["all", "Tümü", "#c9c0b2"],
  ["yuksek", "Yüksek", "oklch(0.58 0.15 35)"],
  ["orta", "Orta", "oklch(0.72 0.13 80)"],
  ["dusuk", "Düşük", "oklch(0.65 0.06 240)"],
];

const PATHS = {
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

const SEED_BOOKS = [
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

const SERIF = "'Newsreader',serif";
const MONO = "'JetBrains Mono',monospace";

const labelStyle = { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 500, color: "#4a443c" };
const authInputStyle = { height: 46, padding: "0 14px", border: "1px solid #d9d2c6", borderRadius: 8, background: "#fffdf9", fontSize: 15, outline: "none" };
const primaryButtonStyle = { height: 48, border: 0, borderRadius: 8, background: "#1f1c18", color: "#f6f3ee", fontSize: 15, fontWeight: 600, cursor: "pointer" };
const dotStyle = (color) => ({ width: 7, height: 7, borderRadius: "50%", background: color });
const tabButtonStyle = (active) => ({
  padding: "10px 14px",
  border: 0,
  background: "none",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  color: active ? "#1f1c18" : "#8a8176",
  borderBottom: `2px solid ${active ? "#1f1c18" : "transparent"}`,
  marginBottom: -1,
  display: "flex",
  gap: 8,
  alignItems: "center",
});
const tabCountStyle = { fontSize: 12, color: "#9a9186", fontFamily: MONO };
const progressTrackStyle = { height: 4, background: "#ece6dc", borderRadius: 2, overflow: "hidden" };
const statLabelStyle = { fontSize: 12, color: "#9a9186" };
const statValueStyle = { fontFamily: SERIF, fontSize: 24 };
const statCellStyle = { padding: "16px 0", display: "flex", flexDirection: "column", gap: 4 };

export default function Home() {
  const [route, setRoute] = useState("home");
  const [bookId, setBookId] = useState(1);
  const [q, setQ] = useState("");
  const [prio, setPrio] = useState("all");
  const [author, setAuthor] = useState("all");
  const [tab, setTab] = useState("pending");
  const [view, setView] = useState("kart");
  const [books, setBooks] = useState(SEED_BOOKS);
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [ptab, setPtab] = useState("okundu");
  const toastTimer = useRef(null);

  const go = (nextRoute, id) => (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setRoute(nextRoute);
    if (id) setBookId(id);
    window.scrollTo(0, 0);
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

  const undo = () => {
    if (!toast) return;
    clearTimeout(toastTimer.current);
    const t = toast;
    setToast(null);
    setBooks((list) => list.map((b) => (b.id === t.id ? { ...b, ...t.snapshot } : b)));
  };

  const decorate = (b) => {
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
      opacity: saving[b.id] ? 0.55 : 1,
      isPending: b.status === "okunacak" || b.status === "okunuyor",
      isClosed: b.status === "okundu" || b.status === "birakildi",
      closedText: b.status === "okundu" ? "✓ " + b.history[0].date + " bitirildi" : "Yarıda bırakıldı",
      history: b.history.map((h) => ({ ...h, color: HISTORY_COLORS[h.kind] })),
      open: go("detail", b.id),
      finish: (e) => {
        e.stopPropagation();
        act(b.id, "okundu", "okundu olarak işaretlendi");
      },
      drop: (e) => {
        e.stopPropagation();
        act(b.id, "birakildi", "bırakıldı");
      },
      restore: (e) => {
        e.stopPropagation();
        act(b.id, b.progress > 0 && b.progress < b.pages ? "okunuyor" : "okunacak", "listeye geri alındı");
      },
    };
  };

  const query = q.trim().toLocaleLowerCase("tr");
  const list = books
    .filter(GROUPS[tab])
    .filter((b) => prio === "all" || b.priority === prio)
    .filter((b) => author === "all" || b.author === author)
    .filter((b) => !query || (b.title + " " + b.author).toLocaleLowerCase("tr").includes(query))
    .sort(
      (a, b) =>
        (STATUS_ORDER[a.status] ?? 2) - (STATUS_ORDER[b.status] ?? 2) ||
        PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    )
    .map(decorate);

  const d = decorate(books.find((b) => b.id === bookId) || books[0]);
  const authors = [...new Set(books.map((b) => b.author))].sort((a, b) => a.localeCompare(b, "tr"));
  const pendingCount = books.filter(GROUPS.pending).length;
  const read = books.filter((b) => b.status === "okundu");
  const readingCount = books.filter((b) => b.status === "okunuyor").length;
  const pagesRead = books.reduce((n, b) => n + (b.status === "birakildi" ? 0 : b.progress), 0);
  const goal = Math.min(100, Math.round((read.length / READING_GOAL) * 100));
  const shelf = books.filter(SHELF_FILTERS[ptab]).map(decorate);

  const isAuthPage = route === "login" || route === "register";
  const routePath = route === "detail" ? `/book/${bookId}` : PATHS[route];

  const homeTabs = [
    ["pending", "Bekleyen", books.filter(GROUPS.pending).length],
    ["done", "Okunan", books.filter(GROUPS.done).length],
    ["dropped", "Bırakılan", books.filter(GROUPS.dropped).length],
  ];

  const profileTabs = [
    ["okundu", "Okuduklarım"],
    ["okunuyor", "Okuyorum"],
    ["tumu", "Tüm kitaplar"],
  ].map(([key, label]) => [key, label, books.filter(SHELF_FILTERS[key]).length]);

  const setProgress = (e) => {
    const value = +e.target.value;
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

  const toggleButtonStyle = (active) => ({
    height: 40,
    padding: "0 12px",
    border: 0,
    background: active ? "#1f1c18" : "#fffdf9",
    color: active ? "#f6f3ee" : "#1f1c18",
    fontSize: 13,
    cursor: "pointer",
  });

  const navLinkStyle = (active) => ({
    padding: "8px 12px",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    color: active ? "#1f1c18" : "#6b645a",
    background: active ? "#ece6dc" : "transparent",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f6f3ee" }}>
      {isAuthPage && (
        <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px clamp(24px,6vw,80px)", gap: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 22, height: 28, background: "#1f1c18", borderRadius: "2px 4px 4px 2px" }} />
              <span style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>ReadLog</span>
            </div>

            {route === "login" && (
              <div style={{ maxWidth: 380, width: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 44, lineHeight: 1.05, margin: 0, letterSpacing: "-0.02em" }}>Tekrar hoş geldin.</h1>
                  <p style={{ margin: 0, color: "#6b645a", fontSize: 16, lineHeight: 1.5 }}>Kaldığın sayfadan devam et.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <label style={labelStyle}>
                    E-posta
                    <input type="email" placeholder="ornek@mail.com" className="rl-input" style={authInputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Şifre
                    <input type="password" placeholder="••••••••" className="rl-input" style={authInputStyle} />
                  </label>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                    <label style={{ display: "flex", gap: 8, alignItems: "center", color: "#6b645a" }}>
                      <input type="checkbox" defaultChecked />
                      Beni hatırla
                    </label>
                    <a href="#">Şifremi unuttum</a>
                  </div>
                  <button onClick={go("home")} className="rl-dark-btn" style={primaryButtonStyle}>Giriş yap</button>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#6b645a" }}>
                  Hesabın yok mu?{" "}
                  <a href="#" onClick={go("register")} style={{ fontWeight: 600 }}>Kayıt ol</a>
                </p>
              </div>
            )}

            {route === "register" && (
              <div style={{ maxWidth: 380, width: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 44, lineHeight: 1.05, margin: 0, letterSpacing: "-0.02em" }}>Rafını kur.</h1>
                  <p style={{ margin: 0, color: "#6b645a", fontSize: 16, lineHeight: 1.5 }}>Okuduklarını ve okuyacaklarını tek yerde topla.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <label style={labelStyle}>
                    Ad soyad
                    <input placeholder="Deniz Aydın" className="rl-input" style={authInputStyle} />
                  </label>
                  <label style={labelStyle}>
                    E-posta
                    <input type="email" placeholder="ornek@mail.com" className="rl-input" style={authInputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Şifre
                    <input type="password" placeholder="En az 8 karakter" className="rl-input" style={authInputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Yıllık okuma hedefi
                    <input type="number" defaultValue={24} className="rl-input" style={authInputStyle} />
                  </label>
                  <button onClick={go("home")} className="rl-dark-btn" style={primaryButtonStyle}>Hesap oluştur</button>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#6b645a" }}>
                  Zaten üye misin?{" "}
                  <a href="#" onClick={go("login")} style={{ fontWeight: 600 }}>Giriş yap</a>
                </p>
              </div>
            )}

            <span style={{ fontFamily: MONO, fontSize: 11, color: "#9a9186" }}>{routePath}</span>
          </div>

          <div style={{ background: "#2a2520", color: "#efe8dc", padding: "clamp(32px,6vw,80px)", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 32, minHeight: 420 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ width: 44, height: 210, background: "oklch(0.5 0.09 40)", borderRadius: 2 }} />
              <div style={{ width: 36, height: 250, background: "oklch(0.5 0.09 150)", borderRadius: 2 }} />
              <div style={{ width: 52, height: 190, background: "#efe8dc", borderRadius: 2 }} />
              <div style={{ width: 30, height: 230, background: "oklch(0.5 0.09 250)", borderRadius: 2 }} />
              <div style={{ width: 40, height: 170, background: "oklch(0.62 0.09 80)", borderRadius: 2 }} />
              <div style={{ width: 38, height: 240, background: "oklch(0.5 0.09 330)", borderRadius: 2, transform: "rotate(-8deg)", transformOrigin: "bottom left", marginLeft: 14 }} />
            </div>
            <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(24px,2.6vw,34px)", lineHeight: 1.25, margin: 0, maxWidth: 520, textWrap: "pretty" }}>
              “Bir kitabı bitirmek, onu rafa değil hafızaya koymaktır.”
            </p>
            <div style={{ display: "flex", gap: 32, fontSize: 13, color: "#b8ad9c" }}>
              <span>
                <b style={{ color: "#efe8dc", fontSize: 20, fontFamily: SERIF, fontWeight: 500 }}>4 kitap</b>
                <br />
                bu ay okundu
              </span>
              <span>
                <b style={{ color: "#efe8dc", fontSize: 20, fontFamily: SERIF, fontWeight: 500 }}>1.284 sayfa</b>
                <br />
                bu ay çevrildi
              </span>
            </div>
          </div>
        </div>
      )}

      {!isAuthPage && (
        <>
          <header style={{ position: "sticky", top: 0, zIndex: 5, background: "rgba(246,243,238,0.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e4ded4" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,40px)", height: 64, display: "flex", alignItems: "center", gap: 24 }}>
              <a href="#" onClick={go("home")} style={{ display: "flex", alignItems: "center", gap: 10, color: "#1f1c18" }}>
                <div style={{ width: 18, height: 24, background: "#1f1c18", borderRadius: "2px 4px 4px 2px" }} />
                <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>ReadLog</span>
              </a>
              <nav style={{ display: "flex", gap: 4, flex: 1 }}>
                <a href="#" onClick={go("home")} style={navLinkStyle(route !== "profile")}>Kitaplığım</a>
                <a href="#" onClick={go("profile")} style={navLinkStyle(route === "profile")}>Profil</a>
              </nav>
              <span style={{ fontFamily: MONO, fontSize: 11, color: "#9a9186" }}>{routePath}</span>
              <button onClick={go("profile")} style={{ width: 36, height: 36, borderRadius: "50%", border: 0, background: "oklch(0.55 0.1 40)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>DA</button>
            </div>
          </header>

          {route === "home" && (
            <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px clamp(16px,4vw,40px) 80px", display: "flex", flexDirection: "column", gap: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: "1 1 400px" }}>
                  <span style={{ fontSize: 13, color: "#6b645a" }}>Günaydın, Deniz</span>
                  <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(34px,4vw,48px)", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
                    Seni bekleyen <em style={{ color: "oklch(0.5 0.12 40)" }}>{pendingCount}</em> kitap var.
                  </h1>
                </div>
                <button className="rl-dark-btn" style={{ height: 42, padding: "0 18px", border: 0, borderRadius: 8, background: "#1f1c18", color: "#f6f3ee", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Kitap ekle</button>
              </div>

              <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #e4ded4" }}>
                {homeTabs.map(([key, label, count]) => (
                  <button key={key} onClick={() => setTab(key)} style={tabButtonStyle(tab === key)}>
                    {label}
                    <span style={tabCountStyle}>{count}</span>
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ flex: "1 1 260px", position: "relative", display: "flex" }}>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Kitap veya yazar ara…"
                    className="rl-input"
                    style={{ flex: 1, height: 42, padding: "0 14px", border: "1px solid #d9d2c6", borderRadius: 8, background: "#fffdf9", fontSize: 14, outline: "none" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#6b645a", marginRight: 2 }}>Öncelik</span>
                  {PRIORITY_CHIPS.map(([key, label, dot]) => {
                    const active = prio === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setPrio(key)}
                        style={{ height: 32, padding: "0 12px", borderRadius: 999, border: `1px solid ${active ? "#1f1c18" : "#d9d2c6"}`, background: active ? "#1f1c18" : "#fffdf9", color: active ? "#f6f3ee" : "#1f1c18", fontSize: 13, cursor: "pointer", display: "flex", gap: 6, alignItems: "center" }}
                      >
                        <span style={dotStyle(dot)} />
                        {label}
                      </button>
                    );
                  })}
                </div>
                <select
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  style={{ height: 42, padding: "0 12px", border: "1px solid #d9d2c6", borderRadius: 8, background: "#fffdf9", fontSize: 14, color: "#1f1c18" }}
                >
                  <option value="all">Tüm yazarlar</option>
                  {authors.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <div style={{ display: "flex", border: "1px solid #d9d2c6", borderRadius: 8, overflow: "hidden" }}>
                  <button onClick={() => setView("kart")} style={toggleButtonStyle(view === "kart")}>Kart</button>
                  <button onClick={() => setView("tablo")} style={toggleButtonStyle(view === "tablo")}>Tablo</button>
                </div>
              </div>

              {list.length === 0 && (
                <div style={{ padding: "64px 24px", textAlign: "center", border: "1px dashed #d9d2c6", borderRadius: 12, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                  <span style={{ fontFamily: SERIF, fontSize: 24 }}>Bu rafta bir şey yok.</span>
                  <button onClick={clearFilters} style={{ border: 0, background: "none", color: "oklch(0.5 0.12 40)", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Filtreleri temizle</button>
                </div>
              )}

              {view === "kart" && list.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))", gap: 20 }}>
                  {list.map((b) => (
                    <article key={b.id} style={{ background: "#fffdf9", border: "1px solid #e4ded4", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 16, opacity: b.opacity, transition: "opacity .2s" }}>
                      <div style={{ display: "flex", gap: 16, cursor: "pointer" }} onClick={b.open}>
                        <div style={{ width: 84, height: 124, flexShrink: 0, background: b.cover, borderRadius: "2px 5px 5px 2px", position: "relative", padding: "10px 8px 10px 14px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 2px rgba(0,0,0,.12),0 6px 14px -6px rgba(0,0,0,.25)" }}>
                          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "rgba(0,0,0,.18)" }} />
                          <span style={{ fontFamily: SERIF, fontSize: 12, lineHeight: 1.15, color: "#f6f1e7", fontWeight: 500 }}>{b.title}</span>
                          <span style={{ fontSize: 8, color: "rgba(246,241,231,.75)", textTransform: "uppercase", letterSpacing: ".06em" }}>{b.authorShort}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, flex: 1 }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: "#6b645a" }}>
                            <span style={dotStyle(b.prioColor)} />
                            {b.prioLabel} öncelik · {b.genre}
                          </div>
                          <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 500, margin: 0, lineHeight: 1.15, letterSpacing: "-0.01em" }}>{b.title}</h3>
                          <span style={{ fontSize: 14, color: "#6b645a" }}>{b.author}</span>
                          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b645a" }}>
                              <span>{b.statusLabel}</span>
                              <span style={{ fontFamily: MONO }}>{b.progressText}</span>
                            </div>
                            <div style={progressTrackStyle}>
                              <div style={{ height: "100%", width: b.pct, background: "#1f1c18", transition: "width .3s" }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      {b.isPending && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={b.finish} className="rl-finish" style={{ flex: 1, height: 38, border: 0, borderRadius: 7, background: "oklch(0.48 0.09 150)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Bitirdim</button>
                          <button onClick={b.drop} className="rl-drop" style={{ flex: 1, height: 38, border: "1px solid #d9d2c6", borderRadius: 7, background: "transparent", color: "#4a443c", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Bırak</button>
                        </div>
                      )}
                      {b.isClosed && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "#6b645a" }}>
                          <span>{b.closedText}</span>
                          <button onClick={b.restore} style={{ height: 34, padding: "0 12px", border: "1px solid #d9d2c6", borderRadius: 7, background: "transparent", fontSize: 13, cursor: "pointer", color: "#1f1c18" }}>Listeye geri al</button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}

              {view === "tablo" && list.length > 0 && (
                <div style={{ background: "#fffdf9", border: "1px solid #e4ded4", borderRadius: 12, overflowX: "auto" }}>
                  <div style={{ minWidth: 720 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "44px minmax(0,2.2fr) minmax(0,1fr) minmax(0,1.2fr) 200px", gap: 16, padding: "12px 18px", borderBottom: "1px solid #e4ded4", fontSize: 12, color: "#9a9186", textTransform: "uppercase", letterSpacing: ".05em" }}>
                      <span />
                      <span>Kitap</span>
                      <span>Öncelik</span>
                      <span>İlerleme</span>
                      <span style={{ textAlign: "right" }}>İşlem</span>
                    </div>
                    {list.map((b) => (
                      <div key={b.id} className="rl-row" style={{ display: "grid", gridTemplateColumns: "44px minmax(0,2.2fr) minmax(0,1fr) minmax(0,1.2fr) 200px", gap: 16, padding: "12px 18px", borderBottom: "1px solid #efeae1", alignItems: "center", opacity: b.opacity }}>
                        <div onClick={b.open} style={{ width: 40, height: 58, background: b.cover, borderRadius: "1px 3px 3px 1px", cursor: "pointer", boxShadow: "0 2px 6px -2px rgba(0,0,0,.3)" }} />
                        <div onClick={b.open} style={{ display: "flex", flexDirection: "column", gap: 2, cursor: "pointer", minWidth: 0 }}>
                          <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 500 }}>{b.title}</span>
                          <span style={{ fontSize: 13, color: "#6b645a" }}>{b.author} · {b.pages} s.</span>
                        </div>
                        <span style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13 }}>
                          <span style={dotStyle(b.prioColor)} />
                          {b.prioLabel}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <span style={{ fontSize: 12, color: "#6b645a", fontFamily: MONO }}>{b.progressText}</span>
                          <div style={progressTrackStyle}>
                            <div style={{ height: "100%", width: b.pct, background: "#1f1c18" }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          {b.isPending && (
                            <>
                              <button onClick={b.finish} style={{ height: 32, padding: "0 12px", border: 0, borderRadius: 6, background: "oklch(0.48 0.09 150)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Bitirdim</button>
                              <button onClick={b.drop} style={{ height: 32, padding: "0 12px", border: "1px solid #d9d2c6", borderRadius: 6, background: "transparent", fontSize: 13, cursor: "pointer", color: "#4a443c" }}>Bırak</button>
                            </>
                          )}
                          {b.isClosed && (
                            <button onClick={b.restore} style={{ height: 32, padding: "0 12px", border: "1px solid #d9d2c6", borderRadius: 6, background: "transparent", fontSize: 13, cursor: "pointer", color: "#1f1c18" }}>Geri al</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>
          )}

          {route === "detail" && (
            <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px clamp(16px,4vw,40px) 80px", display: "flex", flexDirection: "column", gap: 32 }}>
              <a href="#" onClick={go("home")} style={{ fontSize: 14, color: "#6b645a" }}>← Kitaplığa dön</a>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(24px,5vw,56px)", alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: "0 1 280px", minWidth: 200, maxWidth: 300 }}>
                  <div style={{ aspectRatio: "2/3", background: d.cover, borderRadius: "3px 8px 8px 3px", position: "relative", padding: "28px 22px 24px 32px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 2px 4px rgba(0,0,0,.12),0 24px 40px -18px rgba(0,0,0,.45)" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: "rgba(0,0,0,.18)" }} />
                    <span style={{ fontFamily: SERIF, fontSize: 30, lineHeight: 1.1, color: "#f6f1e7", fontWeight: 500 }}>{d.title}</span>
                    <span style={{ fontSize: 12, color: "rgba(246,241,231,.8)", textTransform: "uppercase", letterSpacing: ".08em" }}>{d.author}</span>
                  </div>
                  {d.isPending && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={d.finish} style={{ flex: 1, height: 44, border: 0, borderRadius: 8, background: "oklch(0.48 0.09 150)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Bitirdim</button>
                      <button onClick={d.drop} style={{ flex: 1, height: 44, border: "1px solid #d9d2c6", borderRadius: 8, background: "transparent", color: "#4a443c", fontSize: 14, cursor: "pointer" }}>Bırak</button>
                    </div>
                  )}
                  {d.isClosed && (
                    <button onClick={d.restore} style={{ height: 44, border: "1px solid #d9d2c6", borderRadius: 8, background: "transparent", fontSize: 14, cursor: "pointer", color: "#1f1c18" }}>Listeye geri al</button>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 32, flex: "1 1 420px", minWidth: 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#6b645a", flexWrap: "wrap" }}>
                      <span style={{ padding: "4px 10px", borderRadius: 999, background: "#ece6dc", color: "#1f1c18", fontWeight: 500 }}>{d.statusLabel}</span>
                      <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={dotStyle(d.prioColor)} />
                        {d.prioLabel} öncelik
                      </span>
                    </div>
                    <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(36px,4.5vw,56px)", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.02 }}>{d.title}</h1>
                    <span style={{ fontSize: 18, color: "#4a443c" }}>{d.author}</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", borderTop: "1px solid #e4ded4", borderBottom: "1px solid #e4ded4" }}>
                    <div style={statCellStyle}>
                      <span style={statLabelStyle}>Sayfa</span>
                      <span style={statValueStyle}>{d.pages}</span>
                    </div>
                    <div style={statCellStyle}>
                      <span style={statLabelStyle}>Yayın yılı</span>
                      <span style={statValueStyle}>{d.year}</span>
                    </div>
                    <div style={statCellStyle}>
                      <span style={statLabelStyle}>Tür</span>
                      <span style={statValueStyle}>{d.genre}</span>
                    </div>
                    <div style={statCellStyle}>
                      <span style={statLabelStyle}>Tahmini süre</span>
                      <span style={statValueStyle}>{d.hours} sa</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>Nerede kaldın?</span>
                      <span style={{ fontFamily: MONO, fontSize: 13, color: "#6b645a" }}>{d.progressText}</span>
                    </div>
                    <input type="range" min={0} max={d.pages} value={d.progress} onChange={setProgress} style={{ width: "100%", accentColor: "#1f1c18" }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Açıklama</h2>
                    <p style={{ margin: 0, fontFamily: SERIF, fontSize: 19, lineHeight: 1.55, color: "#34302a", textWrap: "pretty", maxWidth: "62ch" }}>{d.desc}</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 32 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                        Notlar <span style={{ color: "#9a9186", fontWeight: 400 }}>{d.notes.length}</span>
                      </h2>
                      {d.notes.map((n, i) => (
                        <div key={i} style={{ background: "#fffdf9", border: "1px solid #e4ded4", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9a9186" }}>
                            <span>{n.page}</span>
                            <span>{n.date}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{n.text}</p>
                        </div>
                      ))}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <textarea
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Bir alıntı ya da düşünce ekle…"
                          rows={3}
                          className="rl-input"
                          style={{ padding: 12, border: "1px solid #d9d2c6", borderRadius: 8, background: "#fffdf9", fontSize: 14, resize: "vertical", outline: "none" }}
                        />
                        <button onClick={addNote} style={{ alignSelf: "flex-end", height: 36, padding: "0 16px", border: 0, borderRadius: 7, background: "#1f1c18", color: "#f6f3ee", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Not ekle</button>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Geçmiş</h2>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {d.history.map((h, i) => (
                          <div key={i} style={{ display: "grid", gridTemplateColumns: "14px 1fr", gap: 12 }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                              <span style={{ width: 9, height: 9, borderRadius: "50%", background: h.color, marginTop: 5 }} />
                              <span style={{ flex: 1, width: 1, background: "#e4ded4" }} />
                            </div>
                            <div style={{ paddingBottom: 18, display: "flex", flexDirection: "column", gap: 2 }}>
                              <span style={{ fontSize: 14 }}>{h.text}</span>
                              <span style={{ fontSize: 12, color: "#9a9186" }}>{h.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}

          {route === "profile" && (
            <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px clamp(16px,4vw,40px) 80px", display: "flex", flexDirection: "column", gap: 40 }}>
              <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: "oklch(0.55 0.1 40)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 34 }}>DA</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 200 }}>
                  <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 40, margin: 0, letterSpacing: "-0.02em" }}>Deniz Aydın</h1>
                  <span style={{ color: "#6b645a", fontSize: 14 }}>@denizokur · Mart 2024&apos;ten beri okuyor</span>
                </div>
                <button onClick={go("login")} style={{ height: 38, padding: "0 14px", border: "1px solid #d9d2c6", borderRadius: 8, background: "transparent", fontSize: 13, cursor: "pointer", color: "#4a443c" }}>Çıkış yap</button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                <div style={{ background: "#2a2520", color: "#efe8dc", borderRadius: 12, padding: 22, display: "flex", flexDirection: "column", gap: 14, flex: "2 1 360px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "#b8ad9c" }}>2026 okuma hedefi</span>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: "#b8ad9c" }}>%{goal} · {READING_GOAL - read.length} kitap kaldı</span>
                  </div>
                  <span style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1 }}>
                    {read.length} <span style={{ color: "#8c8272" }}>/ {READING_GOAL} kitap</span>
                  </span>
                  <div style={{ height: 6, background: "#443d35", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: goal + "%", background: "oklch(0.72 0.1 80)" }} />
                  </div>
                </div>
                <div style={{ background: "#fffdf9", border: "1px solid #e4ded4", borderRadius: 12, padding: 22, display: "flex", flexDirection: "column", gap: 8, flex: "1 1 180px" }}>
                  <span style={{ fontSize: 13, color: "#6b645a" }}>Okunan sayfa</span>
                  <span style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1 }}>{pagesRead.toLocaleString("tr-TR")}</span>
                </div>
                <div style={{ background: "#fffdf9", border: "1px solid #e4ded4", borderRadius: 12, padding: 22, display: "flex", flexDirection: "column", gap: 8, flex: "1 1 180px" }}>
                  <span style={{ fontSize: 13, color: "#6b645a" }}>Şu an okunan</span>
                  <span style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1 }}>{readingCount}</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #e4ded4" }}>
                  {profileTabs.map(([key, label, count]) => (
                    <button key={key} onClick={() => setPtab(key)} style={tabButtonStyle(ptab === key)}>
                      {label}
                      <span style={tabCountStyle}>{count}</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: "24px 20px" }}>
                  {shelf.map((b) => (
                    <div key={b.id} onClick={b.open} className="rl-lift" style={{ display: "flex", flexDirection: "column", gap: 10, cursor: "pointer" }}>
                      <div style={{ aspectRatio: "2/3", background: b.cover, borderRadius: "2px 5px 5px 2px", position: "relative", padding: "14px 10px 12px 18px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 2px rgba(0,0,0,.12),0 10px 20px -10px rgba(0,0,0,.35)" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: "rgba(0,0,0,.18)" }} />
                        <span style={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.15, color: "#f6f1e7", fontWeight: 500 }}>{b.title}</span>
                        <span style={{ fontSize: 9, color: "rgba(246,241,231,.75)", textTransform: "uppercase", letterSpacing: ".06em" }}>{b.authorShort}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{b.title}</span>
                        <span style={{ fontSize: 12, color: "#6b645a" }}>{b.author}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          )}
        </>
      )}

      {toast && (
        <div style={{ position: "fixed", left: "50%", bottom: 24, transform: "translateX(-50%)", zIndex: 20, maxWidth: "min(92vw,560px)", boxSizing: "border-box", background: "#1f1c18", color: "#f6f3ee", borderRadius: 10, padding: "12px 12px 12px 18px", display: "flex", gap: 16, alignItems: "center", fontSize: 14, boxShadow: "0 12px 30px -10px rgba(0,0,0,.4)", animation: "rlIn .2s ease-out" }}>
          <span>{toast.text}</span>
          <span style={{ fontSize: 12, color: "#9a9186", whiteSpace: "nowrap", flexShrink: 0 }}>{saving[toast.id] ? "kaydediliyor…" : "kaydedildi"}</span>
          <button onClick={undo} style={{ whiteSpace: "nowrap", flexShrink: 0, height: 30, padding: "0 12px", border: 0, borderRadius: 6, background: "#3a342d", color: "#f6f3ee", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Geri al</button>
        </div>
      )}
    </div>
  );
}
