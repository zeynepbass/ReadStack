import { Avatar, Button } from "@/shared/components/atoms";
import { Tabs } from "@/shared/components/molecules";
import { PageContainer } from "@/shared/components/templates";
import GoalCard from "./GoalCard";
import Shelf from "./Shelf";
import StatCard from "./StatCard";

export default function Profile({ readCount, readingCount, pagesRead, tabs, tab, onTabChange, shelf, onOpen, onLogout }) {
  return (
    <PageContainer gap="xl">
      <div className="flex flex-wrap items-center gap-6">
        <Avatar initials="DA" size="lg" />
        <div className="flex min-w-[200px] flex-1 flex-col gap-1">
          <h1 className="m-0 font-serif text-[40px] font-medium tracking-[-0.02em]">Deniz Aydın</h1>
          <span className="text-sm text-muted">@denizokur · Mart 2024&apos;ten beri okuyor</span>
        </div>
        <Button variant="outline" size="lg" onClick={onLogout}>
          Çıkış yap
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <GoalCard readCount={readCount} />
        <StatCard label="Okunan sayfa" value={pagesRead.toLocaleString("tr-TR")} />
        <StatCard label="Şu an okunan" value={readingCount} />
      </div>

      <div className="flex flex-col gap-5">
        <Tabs items={tabs} active={tab} onChange={onTabChange} />
        <Shelf books={shelf} onOpen={onOpen} />
      </div>
    </PageContainer>
  );
}
