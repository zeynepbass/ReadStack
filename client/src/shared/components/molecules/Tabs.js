import { cn } from "@/shared/utils/cn";

export default function Tabs({ items, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-line">
      {items.map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-3.5 py-2.5 text-sm font-medium",
            active === key ? "border-ink text-ink" : "border-transparent text-dim"
          )}
        >
          {label}
          <span className="font-mono text-xs text-faint">{count}</span>
        </button>
      ))}
    </div>
  );
}
