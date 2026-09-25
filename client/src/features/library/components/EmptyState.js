import { Button, Card } from "@/shared/components/atoms";

export default function EmptyState({ onClearFilters }) {
  return (
    <Card variant="dashed" padding="none" className="flex flex-col items-center gap-2.5 px-6 py-16 text-center">
      <span className="font-serif text-2xl">Bu rafta bir şey yok.</span>
      <Button variant="link" size="text" onClick={onClearFilters}>
        Filtreleri temizle
      </Button>
    </Card>
  );
}
