export default function Toast({ text, saving, onUndo }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-20 box-border flex max-w-[min(92vw,560px)] -translate-x-1/2 animate-toast-in items-center gap-4 rounded-[10px] bg-ink py-3 pl-[18px] pr-3 text-sm text-paper shadow-[0_12px_30px_-10px_rgba(0,0,0,.4)]">
      <span>{text}</span>
      <span className="shrink-0 whitespace-nowrap text-xs text-faint">{saving ? "kaydediliyor…" : "kaydedildi"}</span>
      <button
        onClick={onUndo}
        className="h-[30px] shrink-0 cursor-pointer whitespace-nowrap rounded-md bg-ink-hover px-3 text-[13px] font-semibold text-paper"
      >
        Geri al
      </button>
    </div>
  );
}
