import BookCover from "./BookCover";
import PriorityDot from "./PriorityDot";

function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-1 py-4">
      <span className="text-xs text-faint">{label}</span>
      <span className="font-serif text-2xl">{value}</span>
    </div>
  );
}

export default function BookDetail({ book, onBack, actions, onProgressChange, noteDraft, onNoteChange, onAddNote }) {
  return (
    <main className="mx-auto flex max-w-[1100px] flex-col gap-8 px-[clamp(16px,4vw,40px)] pb-20 pt-8">
      <a href="#" onClick={onBack} className="text-sm text-muted">
        ← Kitaplığa dön
      </a>

      <div className="flex flex-wrap items-start gap-[clamp(24px,5vw,56px)]">
        <div className="flex min-w-[200px] max-w-[300px] flex-[0_1_280px] flex-col gap-5">
          <BookCover book={book} variant="detail" />
          {book.isPending && (
            <div className="flex gap-2">
              <button
                onClick={() => actions.onFinish(book.id)}
                className="h-11 flex-1 cursor-pointer rounded-lg bg-success text-sm font-semibold text-white"
              >
                Bitirdim
              </button>
              <button
                onClick={() => actions.onDrop(book.id)}
                className="h-11 flex-1 cursor-pointer rounded-lg border border-field bg-transparent text-sm text-label"
              >
                Bırak
              </button>
            </div>
          )}
          {book.isClosed && (
            <button
              onClick={() => actions.onRestore(book.id)}
              className="h-11 cursor-pointer rounded-lg border border-field bg-transparent text-sm text-ink"
            >
              Listeye geri al
            </button>
          )}
        </div>

        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-8">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
              <span className="rounded-full bg-chip px-2.5 py-1 font-medium text-ink">{book.statusLabel}</span>
              <span className="flex items-center gap-1.5">
                <PriorityDot color={book.prioColor} />
                {book.prioLabel} öncelik
              </span>
            </div>
            <h1 className="m-0 font-serif text-[clamp(36px,4.5vw,56px)] font-medium leading-[1.02] tracking-[-0.02em]">
              {book.title}
            </h1>
            <span className="text-lg text-label">{book.author}</span>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] border-y border-line">
            <Stat label="Sayfa" value={book.pages} />
            <Stat label="Yayın yılı" value={book.year} />
            <Stat label="Tür" value={book.genre} />
            <Stat label="Tahmini süre" value={`${book.hours} sa`} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold">Nerede kaldın?</span>
              <span className="font-mono text-[13px] text-muted">{book.progressText}</span>
            </div>
            <input
              type="range"
              min={0}
              max={book.pages}
              value={book.progress}
              onChange={(e) => onProgressChange(+e.target.value)}
              className="w-full accent-ink"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="m-0 text-sm font-semibold">Açıklama</h2>
            <p className="m-0 max-w-[62ch] font-serif text-[19px] leading-[1.55] text-copy [text-wrap:pretty]">
              {book.desc}
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-8">
            <div className="flex flex-col gap-3.5">
              <h2 className="m-0 text-sm font-semibold">
                Notlar <span className="font-normal text-faint">{book.notes.length}</span>
              </h2>
              {book.notes.map((n, i) => (
                <div key={i} className="flex flex-col gap-1.5 rounded-[10px] border border-line bg-card p-3.5">
                  <div className="flex justify-between text-xs text-faint">
                    <span>{n.page}</span>
                    <span>{n.date}</span>
                  </div>
                  <p className="m-0 text-sm leading-normal">{n.text}</p>
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <textarea
                  value={noteDraft}
                  onChange={(e) => onNoteChange(e.target.value)}
                  placeholder="Bir alıntı ya da düşünce ekle…"
                  rows={3}
                  className="resize-y rounded-lg border border-field bg-card p-3 text-sm text-ink outline-none focus:border-ink"
                />
                <button
                  onClick={onAddNote}
                  className="h-9 cursor-pointer self-end rounded-[7px] bg-ink px-4 text-[13px] font-semibold text-paper"
                >
                  Not ekle
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              <h2 className="m-0 text-sm font-semibold">Geçmiş</h2>
              <div className="flex flex-col">
                {book.history.map((h, i) => (
                  <div key={i} className="grid grid-cols-[14px_1fr] gap-3">
                    <div className="flex flex-col items-center">
                      <span className="mt-[5px] h-[9px] w-[9px] rounded-full" style={{ background: h.color }} />
                      <span className="w-px flex-1 bg-line" />
                    </div>
                    <div className="flex flex-col gap-0.5 pb-[18px]">
                      <span className="text-sm">{h.text}</span>
                      <span className="text-xs text-faint">{h.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
