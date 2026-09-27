import { cn } from "@/shared/utils/cn";

export default function Tabs({ items, active, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto shadow-[inset_0_-1px_0_theme(colors.line.DEFAULT)] [scrollbar-width:none]">
      {items.map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium sm:px-3.5",
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
