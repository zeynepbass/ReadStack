import { Button, Dot } from "@/shared/components/atoms";
import { BookCover } from "@/shared/components/molecules";
import { PageContainer } from "@/shared/components/templates";
import HistoryTimeline from "./HistoryTimeline";
import NotesPanel from "./NotesPanel";
import Stat from "./Stat";

export default function BookDetail({ book, onBack, actions, onProgressChange, noteDraft, onNoteChange, onAddNote, noteSaving }) {
  return (
    <PageContainer width="narrow" gap="lg">
      <a href="#" onClick={onBack} className="text-sm text-muted">
        ← Kitaplığa dön
      </a>

      <div className="flex flex-wrap items-start gap-[clamp(24px,5vw,56px)]">
        <div className="flex min-w-[200px] max-w-[300px] flex-[0_1_280px] flex-col gap-5">
          <BookCover book={book} variant="detail" />
          {book.isPending && (
            <div className="flex gap-2">
              <Button variant="success" size="xl" block onClick={() => actions.onFinish(book.id)}>
                Bitirdim
              </Button>
              <Button variant="outline" size="xl" block onClick={() => actions.onDrop(book.id)}>
                Bırak
              </Button>
            </div>
          )}
          {book.isClosed && (
            <Button variant="secondary" size="xl" onClick={() => actions.onRestore(book.id)}>
              Listeye geri al
            </Button>
          )}
        </div>

        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-8">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
              <span className="rounded-full bg-chip px-2.5 py-1 font-medium text-ink">{book.statusLabel}</span>
              <span className="flex items-center gap-1.5">
                <Dot color={book.prioColor} />
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
            <Stat label="Yayın yılı" value={book.year ?? "—"} />
            <Stat label="Tür" value={book.genre || "—"} />
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
              disabled={book.isClosed}
              className="w-full accent-ink disabled:opacity-60"
            />
          </div>

          {book.desc && (
            <div className="flex flex-col gap-2.5">
              <h2 className="m-0 text-sm font-semibold">Açıklama</h2>
              <p className="m-0 max-w-[62ch] font-serif text-[19px] leading-[1.55] text-copy [text-wrap:pretty]">
                {book.desc}
              </p>
            </div>
          )}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-8">
            <NotesPanel notes={book.notes} draft={noteDraft} onDraftChange={onNoteChange} onAdd={onAddNote} saving={noteSaving} />
            <HistoryTimeline items={book.history} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
