import Image from "next/image";
import { ASSETS } from "@/shared/constants/assets";
import { cn } from "@/shared/utils/cn";

const SIZES = {
  md: { width: 18, height: 24, text: "text-[22px]" },
  lg: { width: 22, height: 28, text: "text-2xl" },
};

export default function Logo({ size = "md" }) {
  const s = SIZES[size];
  return (
    <div className="flex items-center gap-2.5">
      <Image src={ASSETS.logo} alt="" width={s.width} height={s.height} priority />
      <span className={cn("font-serif font-semibold tracking-[-0.01em] text-ink", s.text)}>ReadLog</span>
    </div>
  );
}
