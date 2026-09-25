import { cn } from "@/shared/utils/cn";

const VARIANTS = {
  pill: {
    base: "flex h-8 items-center gap-1.5 rounded-full border px-3",
    active: "border-ink bg-ink text-paper",
    inactive: "border-field bg-card text-ink",
  },
  segment: {
    base: "h-10 px-3",
    active: "bg-ink text-paper",
    inactive: "bg-card text-ink",
  },
};

export default function ToggleButton({ variant = "pill", active = false, className, ...props }) {
  const v = VARIANTS[variant];
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn("cursor-pointer text-[13px]", v.base, active ? v.active : v.inactive, className)}
      {...props}
    />
  );
}
