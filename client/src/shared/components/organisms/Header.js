import { Avatar } from "../atoms";
import { Logo } from "../molecules";

const navClass = (active) =>
  `rounded-md px-3 py-2 text-sm font-medium ${active ? "bg-chip text-ink" : "bg-transparent text-muted"}`;

export default function Header({ route, routePath, onHome, onProfile }) {
  return (
    <header className="sticky top-0 z-[5] border-b border-line bg-paper/[0.92] backdrop-blur-[8px]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-[clamp(16px,4vw,40px)]">
        <a href="#" onClick={onHome}>
          <Logo />
        </a>
        <nav className="flex flex-1 gap-1">
          <a href="#" onClick={onHome} className={navClass(route !== "profile")}>
            Kitaplığım
          </a>
          <a href="#" onClick={onProfile} className={navClass(route === "profile")}>
            Profil
          </a>
        </nav>
        <span className="font-mono text-[11px] text-faint">{routePath}</span>
        <button onClick={onProfile} className="cursor-pointer rounded-full">
          <Avatar initials="DA" size="sm" />
        </button>
      </div>
    </header>
  );
}
