import { useState } from "react";
import { Button, Card, ErrorText, Select, Textarea } from "@/shared/components/atoms";
import { TextField } from "@/shared/components/molecules";

const PRIORITY_OPTIONS = [
  { value: "yuksek", label: "Yüksek" },
  { value: "orta", label: "Orta" },
  { value: "dusuk", label: "Düşük" },
];

const EMPTY = { title: "", author: "", pages: "", priority: "orta", genre: "", year: "", description: "" };

export default function AddBookForm({ onSubmit, onCancel, error, loading }) {
  const [form, setForm] = useState(EMPTY);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      pages: Number(form.pages) || 0,
      year: form.year ? Number(form.year) : undefined,
      genre: form.genre.trim() || undefined,
      description: form.description.trim() || undefined,
    });
  };

  return (
    <Card as="form" onSubmit={handleSubmit} padding="md" className="flex flex-col gap-4">
      <h2 className="m-0 font-serif text-2xl font-medium">Yeni kitap</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-4">
        <TextField label="Kitap adı" required value={form.title} onChange={update("title")} />
        <TextField label="Yazar" required value={form.author} onChange={update("author")} />
        <TextField label="Sayfa sayısı" type="number" min={0} value={form.pages} onChange={update("pages")} />
        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-label">
          Öncelik
          <Select value={form.priority} onChange={update("priority")} options={PRIORITY_OPTIONS} />
        </label>
        <TextField label="Tür" maxLength={60} value={form.genre} onChange={update("genre")} />
        <TextField label="Yayın yılı" type="number" min={0} max={3000} value={form.year} onChange={update("year")} />
      </div>
      <label className="flex flex-col gap-1.5 text-[13px] font-medium text-label">
        Açıklama
        <Textarea rows={3} maxLength={2000} value={form.description} onChange={update("description")} />
      </label>
      <ErrorText>{error}</ErrorText>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="lg" onClick={onCancel}>
          Vazgeç
        </Button>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Ekleniyor…" : "Ekle"}
        </Button>
      </div>
    </Card>
  );
}
