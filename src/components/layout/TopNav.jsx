import { Crown, Search, Trophy, User, X } from "lucide-react";
import { getMaxPoints, getRank, getTotalPoints } from "../../ctf/selectors";
import { LogoMark } from "../brand/LogoMark";
import { DomainSwitcher } from "./DomainSwitcher";

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tracks", label: "Learn" },
  { id: "progress", label: "Progress" },
];

export function TopNav({
  view,
  runtime,
  activeDomainId,
  searchQuery,
  onNavigate,
  onSelectDomain,
  onSearchChange,
}) {
  const points = getTotalPoints(runtime);
  const { current, next } = getRank(points);
  const target = next ? next.minPoints : getMaxPoints();
  const rankProgress = Math.min(100, (points / target) * 100);

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <div className="flex items-center gap-2">
          <button type="button" className="brand" onClick={() => onNavigate("dashboard")} aria-label="Atlas Academy, go to dashboard">
            <LogoMark height={40} />
          </button>
          <span className="h-6 w-px bg-[var(--border)]" aria-hidden="true" />
          <DomainSwitcher activeDomainId={activeDomainId} onSelect={onSelectDomain} />
        </div>

        <nav className="topnav-links" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = (item.match || [item.id]).includes(view);
            return (
              <button
                key={item.id}
                type="button"
                className={`topnav-link ${active ? "active" : ""}`}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="topnav-actions">
          <div className="search-box">
            <Search size={15} />
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search rooms"
              aria-label="Search rooms"
            />
            {searchQuery && (
              <button
                type="button"
                className="grid place-items-center text-[var(--text-faint)] hover:text-[var(--text)]"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <span className="stat-pill" title="Points">
            <Trophy size={15} className="text-[var(--warning)]" />
            {points}
          </span>
          <span className="stat-pill rank-pill" title={next ? `${next.minPoints - points} pts to ${next.name}` : "Top rank"}>
            <Crown size={15} className="text-[var(--accent)]" />
            <span className="grid gap-1">
              <span className="leading-none">{current.name}</span>
              <span className="block h-1 w-20 overflow-hidden rounded-full bg-[var(--page)]">
                <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${rankProgress}%` }} />
              </span>
            </span>
          </span>
          <span className="avatar" aria-label="Your profile">
            <User size={17} />
          </span>
        </div>
      </div>
    </header>
  );
}
