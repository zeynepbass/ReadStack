import { Button } from "../atoms";

export default function Toast({ text, status, onUndo }) {
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-20 box-border flex max-w-[min(92vw,560px)] -translate-x-1/2 animate-toast-in items-center gap-4 rounded-[10px] bg-ink py-3 pl-[18px] pr-3 text-sm text-paper shadow-[0_12px_30px_-10px_rgba(0,0,0,.4)]"
    >
      <span>{text}</span>
      {status && <span className="shrink-0 whitespace-nowrap text-xs text-faint">{status}</span>}
      {onUndo && (
        <Button variant="dark" size="xs" onClick={onUndo} className="shrink-0">
          Geri al
        </Button>
      )}
    </div>
  );
}
