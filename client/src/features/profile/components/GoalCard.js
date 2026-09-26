import { Card, ProgressBar } from "@/shared/components/atoms";

export default function GoalCard({ readCount, goal }) {
  const pct = Math.min(100, Math.round((readCount / goal) * 100));

  return (
    <Card variant="dark" padding="lg" className="flex flex-[2_1_360px] flex-col gap-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="text-[13px] text-sand">{new Date().getFullYear()} okuma hedefi</span>
        <span className="font-mono text-xs text-sand">
          %{pct} · {Math.max(goal - readCount, 0)} kitap kaldı
        </span>
      </div>
      <span className="font-serif text-[40px] leading-none">
        {readCount} <span className="text-stone">/ {goal} kitap</span>
      </span>
      <ProgressBar value={pct + "%"} variant="goal" />
    </Card>
  );
}
