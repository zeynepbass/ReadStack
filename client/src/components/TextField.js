export default function TextField({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-medium text-label">
      {label}
      <input
        className="h-[46px] rounded-lg border border-field bg-card px-3.5 text-[15px] text-ink outline-none focus:border-ink"
        {...props}
      />
    </label>
  );
}
