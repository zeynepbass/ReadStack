import { cn } from "@/shared/utils/cn";

const VARIANTS = {
  default: { track: "h-1 rounded-sm bg-chip", bar: "bg-ink transition-[width] duration-300" },
  goal: { track: "h-1.5 rounded-[3px] bg-track", bar: "bg-gold" },
};

export default function ProgressBar({ value, variant = "default" }) {
  const v = VARIANTS[variant];
  return (
    <div className={cn("overflow-hidden", v.track)}>
      <div className={cn("h-full", v.bar)} style={{ width: value }} />
    </div>
  );
}
