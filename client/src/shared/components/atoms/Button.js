import { cn } from "@/shared/utils/cn";

const VARIANTS = {
  primary: "bg-ink font-semibold text-paper hover:bg-ink-hover",
  success: "bg-success font-semibold text-white hover:bg-success-dark",
  outline: "border border-field bg-transparent font-medium text-label hover:border-danger hover:text-danger-text",
  secondary: "border border-field bg-transparent text-ink",
  dark: "bg-ink-hover font-semibold text-paper",
  link: "border-0 bg-transparent font-semibold text-accent",
};

const SIZES = {
  xs: "h-[30px] rounded-md px-3 text-[13px]",
  sm: "h-8 rounded-md px-3 text-[13px]",
  md: "h-9 rounded-[7px] px-3.5 text-[13px]",
  lg: "h-[38px] rounded-[7px] px-3.5 text-[13px]",
  xl: "h-11 rounded-lg px-[18px] text-sm",
  "2xl": "h-12 rounded-lg px-5 text-[15px]",
  text: "text-sm",
};

export default function Button({ variant = "primary", size = "md", block = false, className, type = "button", ...props }) {
  return (
    <button
      type={type}
      className={cn("cursor-pointer whitespace-nowrap", VARIANTS[variant], SIZES[size], block && "flex-1", className)}
      {...props}
    />
  );
}
