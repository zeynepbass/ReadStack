import Image from "next/image";
import { Logo } from "@/shared/components/molecules";
import { ASSETS } from "@/shared/constants/assets";

export default function AuthLayout({ routePath, children }) {
  return (
    <div className="grid min-h-screen grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))]">
      <div className="flex flex-col justify-between gap-12 px-[clamp(24px,6vw,80px)] py-10">
        <Logo size="lg" />
        {children}
        <span className="font-mono text-[11px] text-faint">{routePath}</span>
      </div>

      <div className="flex min-h-[420px] flex-col justify-end gap-8 bg-dark p-[clamp(32px,6vw,80px)] text-cream">
        <Image src={ASSETS.bookshelf} alt="" width={304} height={250} priority />
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
