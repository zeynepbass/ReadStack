import { Input } from "../atoms";

export default function TextField({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-medium text-label">
      {label}
      <Input size="lg" {...props} />
    </label>
  );
}
