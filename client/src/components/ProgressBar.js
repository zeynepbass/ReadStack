export default function ProgressBar({ value }) {
  return (
    <div className="h-1 overflow-hidden rounded-sm bg-chip">
      <div className="h-full bg-ink transition-[width] duration-300" style={{ width: value }} />
    </div>
  );
}
