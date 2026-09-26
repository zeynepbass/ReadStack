import { PageContainer } from "@/shared/components/templates";

export default function BookDetailStatus({ title, onBack }) {
  return (
    <PageContainer width="narrow" gap="lg">
      <a href="#" onClick={onBack} className="text-sm text-muted">
        ← Kitaplığa dön
      </a>
      <p className="m-0 font-serif text-2xl">{title}</p>
    </PageContainer>
  );
}
