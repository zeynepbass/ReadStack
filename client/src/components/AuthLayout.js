import Logo from "./Logo";

const SPINES = [
  { width: 44, height: 210, color: "oklch(0.5 0.09 40)" },
  { width: 36, height: 250, color: "oklch(0.5 0.09 150)" },
  { width: 52, height: 190, color: "#efe8dc" },
  { width: 30, height: 230, color: "oklch(0.5 0.09 250)" },
  { width: 40, height: 170, color: "oklch(0.62 0.09 80)" },
  { width: 38, height: 240, color: "oklch(0.5 0.09 330)", tilted: true },
];

export default function AuthLayout({ routePath, children }) {
  return (
    <div className="grid min-h-screen grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))]">
      <div className="flex flex-col justify-between gap-12 px-[clamp(24px,6vw,80px)] py-10">
        <Logo large />
        {children}
        <span className="font-mono text-[11px] text-faint">{routePath}</span>
      </div>

      <div className="flex min-h-[420px] flex-col justify-end gap-8 bg-dark p-[clamp(32px,6vw,80px)] text-cream">
        <div className="flex items-end gap-2.5">
          {SPINES.map((s, i) => (
            <div
              key={i}
              className={`rounded-sm ${s.tilted ? "ml-3.5 origin-bottom-left -rotate-[8deg]" : ""}`}
              style={{ width: s.width, height: s.height, background: s.color }}
            />
          ))}
        </div>
        <p className="m-0 max-w-[520px] font-serif text-[clamp(24px,2.6vw,34px)] italic leading-[1.25] [text-wrap:pretty]">
          “Bir kitabı bitirmek, onu rafa değil hafızaya koymaktır.”
        </p>
        <div className="flex gap-8 text-[13px] text-sand">
          <span>
            <b className="font-serif text-xl font-medium text-cream">4 kitap</b>
            <br />
            bu ay okundu
          </span>
          <span>
            <b className="font-serif text-xl font-medium text-cream">1.284 sayfa</b>
            <br />
            bu ay çevrildi
          </span>
        </div>
      </div>
    </div>
  );
}
