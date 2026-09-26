import { Button, Card, Textarea } from "@/shared/components/atoms";

export default function NotesPanel({ notes, draft, onDraftChange, onAdd, saving }) {
  return (
    <div className="flex flex-col gap-3.5">
      <h2 className="m-0 text-sm font-semibold">
        Notlar <span className="font-normal text-faint">{notes.length}</span>
      </h2>
      {notes.map((n) => (
        <Card key={n.id} padding="sm" className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-faint">
            <span>{n.page}</span>
            <span>{n.date}</span>
          </div>
          <p className="m-0 text-sm leading-normal">{n.text}</p>
        </Card>
      ))}
      <div className="flex flex-col gap-2">
        <Textarea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Bir alıntı ya da düşünce ekle…"
          rows={3}
        />
        <Button size="md" onClick={onAdd} disabled={saving || !draft.trim()} className="self-end">
          {saving ? "Ekleniyor…" : "Not ekle"}
        </Button>
      </div>
    </div>
  );
}
