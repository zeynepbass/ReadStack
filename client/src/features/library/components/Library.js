import { Button } from "@/shared/components/atoms";
import { Tabs } from "@/shared/components/molecules";
import { PageContainer } from "@/shared/components/templates";
import BookCard from "./BookCard";
import BookTable from "./BookTable";
import EmptyState from "./EmptyState";
import LibraryFilters from "./LibraryFilters";

export default function Library({ books, pendingCount, tabs, tab, onTabChange, filters, view, onClearFilters, actions }) {
  return (
    <PageContainer gap="md">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-[1_1_400px] flex-col gap-1.5">
          <span className="text-[13px] text-muted">Günaydın, Deniz</span>
          <h1 className="m-0 font-serif text-[clamp(34px,4vw,48px)] font-medium leading-[1.05] tracking-[-0.02em]">
            Seni bekleyen <em className="text-accent">{pendingCount}</em> kitap var.
          </h1>
        </div>
        <Button size="xl">+ Kitap ekle</Button>
      </div>

      <Tabs items={tabs} active={tab} onChange={onTabChange} />

      <LibraryFilters {...filters} view={view} />

      {books.length === 0 && <EmptyState onClearFilters={onClearFilters} />}

      {view === "kart" && books.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5">
          {books.map((b) => (
            <BookCard key={b.id} book={b} {...actions} />
          ))}
        </div>
      )}

      {view === "tablo" && books.length > 0 && <BookTable books={books} {...actions} />}
    </PageContainer>
  );
}
