const VARIANTS = {
  card: {
    box: "h-[124px] w-[84px] shrink-0 rounded-[2px_5px_5px_2px] py-2.5 pl-3.5 pr-2 shadow-[0_1px_2px_rgba(0,0,0,.12),0_6px_14px_-6px_rgba(0,0,0,.25)]",
    spine: "w-[5px]",
    title: "text-xs",
    author: "text-[8px] tracking-[.06em] text-cover/75",
  },
  shelf: {
    box: "aspect-[2/3] rounded-[2px_5px_5px_2px] pb-3 pl-[18px] pr-2.5 pt-3.5 shadow-[0_1px_2px_rgba(0,0,0,.12),0_10px_20px_-10px_rgba(0,0,0,.35)]",
    spine: "w-1.5",
    title: "text-base",
    author: "text-[9px] tracking-[.06em] text-cover/75",
  },
  detail: {
    box: "aspect-[2/3] rounded-[3px_8px_8px_3px] pb-6 pl-8 pr-[22px] pt-7 shadow-[0_2px_4px_rgba(0,0,0,.12),0_24px_40px_-18px_rgba(0,0,0,.45)]",
    spine: "w-2.5",
    title: "text-[30px] leading-[1.1]",
    author: "text-xs tracking-[.08em] text-cover/80",
  },
};

export default function BookCover({ book, variant = "card" }) {
  const v = VARIANTS[variant];
  return (
    <div
      className={`relative box-border flex flex-col justify-between ${v.box}`}
      style={{ background: book.cover }}
    >
      <div className={`absolute inset-y-0 left-0 bg-black/[0.18] ${v.spine}`} />
      <span className={`font-serif font-medium leading-[1.15] text-cover ${v.title}`}>{book.title}</span>
      <span className={`uppercase ${v.author}`}>{variant === "detail" ? book.author : book.authorShort}</span>
    </div>
  );
}
