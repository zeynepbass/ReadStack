export default function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-1 py-4">
      <span className="text-xs text-faint">{label}</span>
      <span className="font-serif text-2xl">{value}</span>
    </div>
  );
}
