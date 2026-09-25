import { Card, ProgressBar } from "@/shared/components/atoms";
import { READING_GOAL } from "@/shared/utils/books";

export default function GoalCard({ readCount }) {
  const goal = Math.min(100, Math.round((readCount / READING_GOAL) * 100));

  return (
    <Card variant="dark" padding="lg" className="flex flex-[2_1_360px] flex-col gap-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="text-[13px] text-sand">2026 okuma hedefi</span>
        <span className="font-mono text-xs text-sand">
          %{goal} · {READING_GOAL - readCount} kitap kaldı
        </span>
      </div>
      <span className="font-serif text-[40px] leading-none">
        {readCount} <span className="text-stone">/ {READING_GOAL} kitap</span>
      </span>
      <ProgressBar value={goal + "%"} variant="goal" />
    </Card>
  );
}
