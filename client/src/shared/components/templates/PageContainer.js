import { cn } from "@/shared/utils/cn";

const WIDTHS = {
  default: "max-w-[1200px] pt-10",
  narrow: "max-w-[1100px] pt-8",
};

const GAPS = {
  md: "gap-7",
  lg: "gap-8",
  xl: "gap-10",
};

export default function PageContainer({ width = "default", gap = "md", children }) {
  return (
    <main className={cn("mx-auto flex flex-col px-[clamp(16px,4vw,40px)] pb-20", WIDTHS[width], GAPS[gap])}>{children}</main>
  );
}
