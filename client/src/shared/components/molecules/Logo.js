import { cn } from "@/shared/utils/cn";

const SIZES = {
  md: { mark: "h-6 w-[18px]", text: "text-[22px]" },
  lg: { mark: "h-7 w-[22px]", text: "text-2xl" },
};

export default function Logo({ size = "md" }) {
  const s = SIZES[size];
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn("rounded-[2px_4px_4px_2px] bg-ink", s.mark)} />
      <span className={cn("font-serif font-semibold tracking-[-0.01em] text-ink", s.text)}>ReadLog</span>
    </div>
  );
}
