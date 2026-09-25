import { Button, Card, Dot, ProgressBar } from "@/shared/components/atoms";
import { BookCover } from "@/shared/components/molecules";
import { cn } from "@/shared/utils/cn";

const stop = (fn) => (e) => {
  e.stopPropagation();
  fn();
};

export default function BookCard({ book, onOpen, onFinish, onDrop, onRestore }) {
  return (
    <Card
      as="article"
      className={cn("flex flex-col gap-4 transition-opacity duration-200", book.isSaving ? "opacity-[0.55]" : "opacity-100")}
    >
      <div className="flex cursor-pointer gap-4" onClick={() => onOpen(book.id)}>
        <BookCover book={book} variant="card" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Dot color={book.prioColor} />
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
          <Button variant="success" size="lg" block onClick={stop(() => onFinish(book.id))}>
            Bitirdim
          </Button>
          <Button variant="outline" size="lg" block onClick={stop(() => onDrop(book.id))}>
            Bırak
          </Button>
        </div>
      )}

      {book.isClosed && (
        <div className="flex items-center justify-between text-[13px] text-muted">
          <span>{book.closedText}</span>
          <Button variant="secondary" size="md" onClick={stop(() => onRestore(book.id))}>
            Listeye geri al
          </Button>
        </div>
      )}
    </Card>
  );
}
