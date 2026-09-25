export default function Logo({ large = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`rounded-[2px_4px_4px_2px] bg-ink ${large ? "h-7 w-[22px]" : "h-6 w-[18px]"}`} />
      <span className={`font-serif font-semibold tracking-[-0.01em] text-ink ${large ? "text-2xl" : "text-[22px]"}`}>
        ReadLog
      </span>
    </div>
  );
}
