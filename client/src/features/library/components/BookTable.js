import { Button, Card, Dot, ProgressBar } from "@/shared/components/atoms";
import { BookCover } from "@/shared/components/molecules";
import { cn } from "@/shared/utils/cn";

const GRID = "grid grid-cols-[44px_minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1.2fr)_200px] gap-4 px-[18px] py-3";

export default function BookTable({ books, onOpen, onFinish, onDrop, onRestore }) {
  return (
    <Card padding="none" className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div className={cn(GRID, "border-b border-line text-xs uppercase tracking-[.05em] text-faint")}>
          <span />
          <span>Kitap</span>
          <span>Öncelik</span>
          <span>İlerleme</span>
          <span className="text-right">İşlem</span>
        </div>

        {books.map((b) => (
          <div key={b.id} className={cn(GRID, "items-center border-b border-line-soft hover:bg-row", b.isSaving && "opacity-[0.55]")}>
            <BookCover book={b} variant="thumb" onClick={() => onOpen(b.id)} />
            <div onClick={() => onOpen(b.id)} className="flex min-w-0 cursor-pointer flex-col gap-0.5">
              <span className="font-serif text-[17px] font-medium">{b.title}</span>
              <span className="text-[13px] text-muted">
                {b.author} · {b.pages} s.
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[13px]">
              <Dot color={b.prioColor} />
              {b.prioLabel}
            </span>
            <div className="flex flex-col gap-[5px]">
              <span className="font-mono text-xs text-muted">{b.progressText}</span>
              <ProgressBar value={b.pct} />
            </div>
            <div className="flex justify-end gap-1.5">
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
