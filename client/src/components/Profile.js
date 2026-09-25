import { READING_GOAL } from "@/lib/books";
import BookCover from "./BookCover";
import Tabs from "./Tabs";

export default function Profile({ readCount, readingCount, pagesRead, tabs, tab, onTabChange, shelf, onOpen, onLogout }) {
  const goal = Math.min(100, Math.round((readCount / READING_GOAL) * 100));

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-10 px-[clamp(16px,4vw,40px)] pb-20 pt-10">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-avatar font-serif text-[34px] text-white">
          DA
        </div>
        <div className="flex min-w-[200px] flex-1 flex-col gap-1">
          <h1 className="m-0 font-serif text-[40px] font-medium tracking-[-0.02em]">Deniz Aydın</h1>
          <span className="text-sm text-muted">@denizokur · Mart 2024&apos;ten beri okuyor</span>
        </div>
        <button
          onClick={onLogout}
          className="h-[38px] cursor-pointer rounded-lg border border-field bg-transparent px-3.5 text-[13px] text-label"
        >
          Çıkış yap
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-[2_1_360px] flex-col gap-3.5 rounded-xl bg-dark p-[22px] text-cream">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="text-[13px] text-sand">2026 okuma hedefi</span>
            <span className="font-mono text-xs text-sand">
              %{goal} · {READING_GOAL - readCount} kitap kaldı
            </span>
          </div>
          <span className="font-serif text-[40px] leading-none">
            {readCount} <span className="text-stone">/ {READING_GOAL} kitap</span>
          </span>
          <div className="h-1.5 overflow-hidden rounded-[3px] bg-track">
            <div className="h-full bg-gold" style={{ width: goal + "%" }} />
          </div>
        </div>
        <div className="flex flex-[1_1_180px] flex-col gap-2 rounded-xl border border-line bg-card p-[22px]">
          <span className="text-[13px] text-muted">Okunan sayfa</span>
          <span className="font-serif text-[40px] leading-none">{pagesRead.toLocaleString("tr-TR")}</span>
        </div>
        <div className="flex flex-[1_1_180px] flex-col gap-2 rounded-xl border border-line bg-card p-[22px]">
          <span className="text-[13px] text-muted">Şu an okunan</span>
          <span className="font-serif text-[40px] leading-none">{readingCount}</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Tabs items={tabs} active={tab} onChange={onTabChange} />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-5 gap-y-6">
          {shelf.map((b) => (
            <div
              key={b.id}
              onClick={() => onOpen(b.id)}
              className="flex cursor-pointer flex-col gap-2.5 transition-transform duration-200 hover:-translate-y-[3px]"
            >
              <BookCover book={b} variant="shelf" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium leading-[1.3]">{b.title}</span>
                <span className="text-xs text-muted">{b.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
