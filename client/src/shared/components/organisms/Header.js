import { Avatar } from "../atoms";
import { Logo } from "../molecules";

const navClass = (active) =>
  `whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium sm:px-3 ${active ? "bg-chip text-ink" : "bg-transparent text-muted"}`;

export default function Header({ route, userInitials, onHome, onProfile }) {
  return (
    <header className="sticky top-0 z-[5] border-b border-line bg-paper/[0.92] backdrop-blur-[8px]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-[clamp(16px,4vw,40px)]">
        <a href="#" onClick={onHome}>
          <Logo compact />
        </a>
        <nav className="flex min-w-0 flex-1 gap-1 sm:ml-3">
          <a href="#" onClick={onHome} className={navClass(route !== "profile")}>
            Kitaplığım
          </a>
          <a href="#" onClick={onProfile} className={navClass(route === "profile")}>
            Profil
          </a>
        </nav>
        <button onClick={onProfile} className="cursor-pointer rounded-full">
          <Avatar initials={userInitials} size="sm" />
        </button>
      </div>
    </header>
  );
}
