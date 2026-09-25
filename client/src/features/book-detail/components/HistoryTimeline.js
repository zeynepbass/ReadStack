export default function HistoryTimeline({ items }) {
  return (
    <div className="flex flex-col gap-3.5">
      <h2 className="m-0 text-sm font-semibold">Geçmiş</h2>
      <div className="flex flex-col">
        {items.map((h, i) => (
          <div key={i} className="grid grid-cols-[14px_1fr] gap-3">
            <div className="flex flex-col items-center">
              <span className="mt-[5px] h-[9px] w-[9px] rounded-full" style={{ background: h.color }} />
              <span className="w-px flex-1 bg-line" />
            </div>
            <div className="flex flex-col gap-0.5 pb-[18px]">
              <span className="text-sm">{h.text}</span>
              <span className="text-xs text-faint">{h.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
