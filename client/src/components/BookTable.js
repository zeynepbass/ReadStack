import PriorityDot from "./PriorityDot";
import ProgressBar from "./ProgressBar";

const GRID = "grid grid-cols-[44px_minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1.2fr)_200px] gap-4 px-[18px] py-3";

export default function BookTable({ books, onOpen, onFinish, onDrop, onRestore }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-card">
      <div className="min-w-[720px]">
        <div className={`${GRID} border-b border-line text-xs uppercase tracking-[.05em] text-faint`}>
          <span />
          <span>Kitap</span>
          <span>Öncelik</span>
          <span>İlerleme</span>
          <span className="text-right">İşlem</span>
        </div>

        {books.map((b) => (
          <div
            key={b.id}
            className={`${GRID} items-center border-b border-line-soft hover:bg-row ${b.isSaving ? "opacity-[0.55]" : ""}`}
          >
            <div
              onClick={() => onOpen(b.id)}
              className="h-[58px] w-10 cursor-pointer rounded-[1px_3px_3px_1px] shadow-[0_2px_6px_-2px_rgba(0,0,0,.3)]"
              style={{ background: b.cover }}
            />
            <div onClick={() => onOpen(b.id)} className="flex min-w-0 cursor-pointer flex-col gap-0.5">
              <span className="font-serif text-[17px] font-medium">{b.title}</span>
              <span className="text-[13px] text-muted">
                {b.author} · {b.pages} s.
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[13px]">
              <PriorityDot color={b.prioColor} />
              {b.prioLabel}
            </span>
            <div className="flex flex-col gap-[5px]">
              <span className="font-mono text-xs text-muted">{b.progressText}</span>
              <ProgressBar value={b.pct} />
            </div>
            <div className="flex justify-end gap-1.5">
              {b.isPending && (
                <>
                  <button
                    onClick={() => onFinish(b.id)}
                    className="h-8 cursor-pointer rounded-md bg-success px-3 text-[13px] font-semibold text-white"
                  >
                    Bitirdim
                  </button>
                  <button
                    onClick={() => onDrop(b.id)}
                    className="h-8 cursor-pointer rounded-md border border-field bg-transparent px-3 text-[13px] text-label"
                  >
                    Bırak
                  </button>
                </>
              )}
              {b.isClosed && (
                <button
                  onClick={() => onRestore(b.id)}
                  className="h-8 cursor-pointer rounded-md border border-field bg-transparent px-3 text-[13px] text-ink"
                >
                  Geri al
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
