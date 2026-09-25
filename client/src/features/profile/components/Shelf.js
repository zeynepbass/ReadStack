import { BookCover } from "@/shared/components/molecules";

export default function Shelf({ books, onOpen }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-5 gap-y-6">
      {books.map((b) => (
        <div
          key={b.id}
          onClick={() => onOpen(b.id)}
          className="flex cursor-pointer flex-col gap-2.5 transition-transform duration-200 hover:-translate-y-[3px]"
        >
          <BookCover book={b} variant="shelf" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium leading-[1.3]">{b.title}</span>
            <span className="text-xs text-muted">{b.author}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
