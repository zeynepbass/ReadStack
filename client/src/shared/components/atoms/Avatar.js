import { cn } from "@/shared/utils/cn";

const SIZES = {
  sm: "h-9 w-9 text-[13px] font-semibold",
  lg: "h-[88px] w-[88px] font-serif text-[34px]",
};

export default function Avatar({ initials, size = "sm" }) {
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-full bg-avatar text-white", SIZES[size])}>
      {initials}
    </div>
  );
}
