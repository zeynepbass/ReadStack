import BookCover from "./BookCover";
import PriorityDot from "./PriorityDot";
import ProgressBar from "./ProgressBar";

const stop = (fn) => (e) => {
  e.stopPropagation();
  fn();
};

export default function BookCard({ book, onOpen, onFinish, onDrop, onRestore }) {
  return (
    <article
      className={`flex flex-col gap-4 rounded-xl border border-line bg-card p-[18px] transition-opacity duration-200 ${
        book.isSaving ? "opacity-[0.55]" : "opacity-100"
      }`}
    >
      <div className="flex cursor-pointer gap-4" onClick={() => onOpen(book.id)}>
        <BookCover book={book} variant="card" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <PriorityDot color={book.prioColor} />
            {book.prioLabel} öncelik · {book.genre}
          </div>
          <h3 className="m-0 font-serif text-[21px] font-medium leading-[1.15] tracking-[-0.01em]">{book.title}</h3>
          <span className="text-sm text-muted">{book.author}</span>
          <div className="mt-auto flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-muted">
              <span>{book.statusLabel}</span>
              <span className="font-mono">{book.progressText}</span>
            </div>
            <ProgressBar value={book.pct} />
          </div>
        </div>
      </div>

      {book.isPending && (
        <div className="flex gap-2">
          <button
            onClick={stop(() => onFinish(book.id))}
            className="h-[38px] flex-1 cursor-pointer rounded-[7px] bg-success text-[13px] font-semibold text-white hover:bg-success-dark"
          >
            Bitirdim
          </button>
          <button
            onClick={stop(() => onDrop(book.id))}
            className="h-[38px] flex-1 cursor-pointer rounded-[7px] border border-field bg-transparent text-[13px] font-medium text-label hover:border-danger hover:text-danger-text"
          >
            Bırak
          </button>
        </div>
      )}

      {book.isClosed && (
        <div className="flex items-center justify-between text-[13px] text-muted">
          <span>{book.closedText}</span>
          <button
            onClick={stop(() => onRestore(book.id))}
            className="h-[34px] cursor-pointer rounded-[7px] border border-field bg-transparent px-3 text-[13px] text-ink"
          >
            Listeye geri al
          </button>
        </div>
      )}
    </article>
  );
}
