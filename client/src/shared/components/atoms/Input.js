import { cn } from "@/shared/utils/cn";

const SIZES = {
  md: "h-[42px] text-sm",
  lg: "h-[46px] text-[15px]",
};

export default function Input({ size = "md", block = false, className, ...props }) {
  return (
    <input
      className={cn(
        "rounded-lg border border-field bg-card px-3.5 text-ink outline-none focus:border-ink",
        SIZES[size],
        block && "flex-1",
        className
      )}
      {...props}
    />
  );
}
