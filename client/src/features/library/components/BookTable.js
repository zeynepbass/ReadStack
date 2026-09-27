import { Button, Card, Dot, ProgressBar } from "@/shared/components/atoms";
import { BookCover } from "@/shared/components/molecules";
import { cn } from "@/shared/utils/cn";

const GRID =
  "grid grid-cols-[44px_minmax(0,1fr)] gap-x-4 gap-y-2.5 px-[18px] py-3 md:grid-cols-[44px_minmax(0,2.2fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_auto] md:gap-y-4";

export default function BookTable({ books, onOpen, onFinish, onDrop, onRestore }) {
  return (
    <Card padding="none">
      <div>
        <div className={cn(GRID, "hidden border-b border-line text-xs uppercase tracking-[.05em] text-faint md:grid")}>
          <span />
          <span>Kitap</span>
          <span>Öncelik</span>
          <span>İlerleme</span>
          <span className="text-right">İşlem</span>
        </div>

        {books.map((b) => (
          <div key={b.id} className={cn(GRID, "items-center border-b border-line-soft hover:bg-row", b.isSaving && "opacity-[0.55]")}>
            <div className="row-span-4 self-start md:row-span-1 md:self-center">
              <BookCover book={b} variant="thumb" onClick={() => onOpen(b.id)} />
            </div>
            <div onClick={() => onOpen(b.id)} className="flex min-w-0 cursor-pointer flex-col gap-0.5">
              <span className="font-serif text-[17px] font-medium">{b.title}</span>
              <span className="text-[13px] text-muted">
                {b.author} · {b.pages} s.
              </span>
            </div>
            <span className="col-start-2 flex items-center gap-1.5 text-[13px] md:col-start-auto">
              <Dot color={b.prioColor} />
              {b.prioLabel}
            </span>
            <div className="col-start-2 flex flex-col gap-[5px] md:col-start-auto">
              <span className="font-mono text-xs text-muted">{b.progressText}</span>
              <ProgressBar value={b.pct} />
            </div>
            <div className="col-start-2 flex gap-1.5 md:col-start-auto md:justify-end">
              {b.isPending && (
                <>
                  <Button variant="success" size="sm" onClick={() => onFinish(b.id)}>
                    Bitirdim
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDrop(b.id)}>
                    Bırak
                  </Button>
                </>
              )}
              {b.isClosed && (
                <Button variant="secondary" size="sm" onClick={() => onRestore(b.id)}>
                  Geri al
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
