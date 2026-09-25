import { Dot, Input, Select, ToggleButton } from "@/shared/components/atoms";
import { SegmentedControl } from "@/shared/components/molecules";
import { PRIORITY_CHIPS } from "@/shared/utils/books";

const VIEW_OPTIONS = [
  { value: "kart", label: "Kart" },
  { value: "tablo", label: "Tablo" },
];

export default function LibraryFilters({ q, onSearch, prio, onPrioChange, author, authors, onAuthorChange, view, onViewChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex flex-[1_1_260px]">
        <Input value={q} onChange={(e) => onSearch(e.target.value)} placeholder="Kitap veya yazar ara…" block />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-0.5 text-xs text-muted">Öncelik</span>
        {PRIORITY_CHIPS.map(([key, label, dot]) => (
          <ToggleButton key={key} active={prio === key} onClick={() => onPrioChange(key)}>
            <Dot color={dot} />
            {label}
          </ToggleButton>
        ))}
      </div>

      <Select
        value={author}
        onChange={(e) => onAuthorChange(e.target.value)}
        options={[{ value: "all", label: "Tüm yazarlar" }, ...authors.map((a) => ({ value: a, label: a }))]}
      />

      <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={onViewChange} />
    </div>
  );
}
