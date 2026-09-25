import { PRIORITY_CHIPS } from "@/lib/books";
import BookCard from "./BookCard";
import BookTable from "./BookTable";
import PriorityDot from "./PriorityDot";
import Tabs from "./Tabs";

const toggleClass = (active) =>
  `h-10 cursor-pointer px-3 text-[13px] ${active ? "bg-ink text-paper" : "bg-card text-ink"}`;

export default function Library({
  books,
  pendingCount,
  tabs,
  tab,
  onTabChange,
  q,
  onSearch,
  prio,
  onPrioChange,
  author,
  authors,
  onAuthorChange,
  view,
  onViewChange,
  onClearFilters,
  actions,
}) {
  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-7 px-[clamp(16px,4vw,40px)] pb-20 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-[1_1_400px] flex-col gap-1.5">
          <span className="text-[13px] text-muted">Günaydın, Deniz</span>
          <h1 className="m-0 font-serif text-[clamp(34px,4vw,48px)] font-medium leading-[1.05] tracking-[-0.02em]">
            Seni bekleyen <em className="text-accent">{pendingCount}</em> kitap var.
          </h1>
        </div>
        <button className="h-[42px] cursor-pointer rounded-lg bg-ink px-[18px] text-sm font-semibold text-paper hover:bg-ink-hover">
          + Kitap ekle
        </button>
      </div>

      <Tabs items={tabs} active={tab} onChange={onTabChange} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex flex-[1_1_260px]">
          <input
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Kitap veya yazar ara…"
            className="h-[42px] flex-1 rounded-lg border border-field bg-card px-3.5 text-sm text-ink outline-none focus:border-ink"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-0.5 text-xs text-muted">Öncelik</span>
          {PRIORITY_CHIPS.map(([key, label, dot]) => (
            <button
              key={key}
              onClick={() => onPrioChange(key)}
              className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] ${
                prio === key ? "border-ink bg-ink text-paper" : "border-field bg-card text-ink"
              }`}
            >
              <PriorityDot color={dot} />
              {label}
            </button>
          ))}
        </div>

        <select
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          className="h-[42px] rounded-lg border border-field bg-card px-3 text-sm text-ink"
        >
          <option value="all">Tüm yazarlar</option>
          {authors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <div className="flex overflow-hidden rounded-lg border border-field">
          <button onClick={() => onViewChange("kart")} className={toggleClass(view === "kart")}>
            Kart
          </button>
          <button onClick={() => onViewChange("tablo")} className={toggleClass(view === "tablo")}>
            Tablo
          </button>
        </div>
      </div>

      {books.length === 0 && (
        <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-field px-6 py-16 text-center">
          <span className="font-serif text-2xl">Bu rafta bir şey yok.</span>
          <button
            onClick={onClearFilters}
            className="cursor-pointer border-0 bg-transparent text-sm font-semibold text-accent"
          >
            Filtreleri temizle
          </button>
        </div>
      )}

      {view === "kart" && books.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5">
          {books.map((b) => (
            <BookCard key={b.id} book={b} {...actions} />
          ))}
        </div>
      )}

      {view === "tablo" && books.length > 0 && <BookTable books={books} {...actions} />}
    </main>
  );
}
