import { Card } from "@/shared/components/atoms";

export default function StatCard({ label, value }) {
  return (
    <Card padding="lg" className="flex flex-[1_1_180px] flex-col gap-2">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="font-serif text-[40px] leading-none">{value}</span>
    </Card>
  );
}
