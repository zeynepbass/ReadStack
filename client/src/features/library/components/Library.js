import { Button } from "@/shared/components/atoms";
import { Tabs } from "@/shared/components/molecules";
import { PageContainer } from "@/shared/components/templates";
import AddBookForm from "./AddBookForm";
import BookCard from "./BookCard";
import BookTable from "./BookTable";
import EmptyState from "./EmptyState";
import LibraryFilters from "./LibraryFilters";

export default function Library({
  books,
  greeting,
  pendingCount,
  tabs,
  tab,
  onTabChange,
  filters,
  view,
  onClearFilters,
  actions,
  loading,
  error,
  onRetry,
  addForm,
}) {
  const ready = !loading && !error;

  return (
    <PageContainer gap="md">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-[1_1_400px] flex-col gap-1.5">
          <span className="text-[13px] text-muted">{greeting}</span>
          <h1 className="m-0 font-serif text-[clamp(34px,4vw,48px)] font-medium leading-[1.05] tracking-[-0.02em]">
            Seni bekleyen <em className="text-accent">{pendingCount}</em> kitap var.
          </h1>
        </div>
        <Button size="xl" onClick={addForm.onOpen}>
          + Kitap ekle
        </Button>
      </div>

      {addForm.open && (
        <AddBookForm onSubmit={addForm.onSubmit} onCancel={addForm.onClose} error={addForm.error} loading={addForm.loading} />
      )}

      <Tabs items={tabs} active={tab} onChange={onTabChange} />

      <LibraryFilters {...filters} view={view} />

      {loading && <EmptyState title="Kitaplar yükleniyor…" />}

      {error && <EmptyState title={error} actionLabel="Tekrar dene" onAction={onRetry} />}

      {ready && books.length === 0 && (
        <EmptyState title="Bu rafta bir şey yok." actionLabel="Filtreleri temizle" onAction={onClearFilters} />
      )}

      {ready && view === "kart" && books.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5">
          {books.map((b) => (
            <BookCard key={b.id} book={b} {...actions} />
          ))}
        </div>
      )}

      {ready && view === "tablo" && books.length > 0 && <BookTable books={books} {...actions} />}
    </PageContainer>
  );
}
