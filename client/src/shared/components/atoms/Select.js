import { cn } from "@/shared/utils/cn";

const SIZES = {
  md: "h-[42px] text-sm",
};

export default function Select({ options, size = "md", className, ...props }) {
  return (
    <select className={cn("rounded-lg border border-field bg-card px-3 text-ink", SIZES[size], className)} {...props}>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
