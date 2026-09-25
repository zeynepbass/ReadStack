import { cn } from "@/shared/utils/cn";

const VARIANTS = {
  default: "rounded-xl border border-line bg-card",
  dark: "rounded-xl bg-dark text-cream",
  dashed: "rounded-xl border border-dashed border-field",
};

const PADDINGS = {
  none: "",
  sm: "p-3.5",
  md: "p-[18px]",
  lg: "p-[22px]",
};

export default function Card({ as: Tag = "div", variant = "default", padding = "md", className, ...props }) {
  return <Tag className={cn(VARIANTS[variant], PADDINGS[padding], className)} {...props} />;
}
