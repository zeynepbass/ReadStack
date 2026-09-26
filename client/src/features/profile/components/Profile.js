import { Avatar, Button } from "@/shared/components/atoms";
import { Tabs } from "@/shared/components/molecules";
import { PageContainer } from "@/shared/components/templates";
import GoalCard from "./GoalCard";
import Shelf from "./Shelf";
import StatCard from "./StatCard";

export default function Profile({ user, goal, readCount, readingCount, pagesRead, tabs, tab, onTabChange, shelf, onOpen, onLogout }) {
  return (
    <PageContainer gap="xl">
      <div className="flex flex-wrap items-center gap-6">
        <Avatar initials={user.initials} size="lg" />
        <div className="flex min-w-[200px] flex-1 flex-col gap-1">
          <h1 className="m-0 font-serif text-[40px] font-medium tracking-[-0.02em]">{user.name}</h1>
          <span className="text-sm text-muted">{user.email}</span>
        </div>
        <Button variant="outline" size="lg" onClick={onLogout}>
          Çıkış yap
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <GoalCard readCount={readCount} goal={goal} />
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
