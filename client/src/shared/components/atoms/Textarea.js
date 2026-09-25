import { cn } from "@/shared/utils/cn";

export default function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "resize-y rounded-lg border border-field bg-card p-3 text-sm text-ink outline-none focus:border-ink",
        className
      )}
      {...props}
    />
  );
}
