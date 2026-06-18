import { Flag, Home, Layers, ShieldCheck, Trophy } from "lucide-react";
import { challenges } from "../../ctf/data";

export function Sidebar({ view, onNavigate, completedCount }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "tracks", label: "Learning Paths", icon: Layers },
    { id: "challenges", label: "Challenges", icon: Flag },
    { id: "progress", label: "Progression", icon: Trophy },
  ];

  const progress = (completedCount / challenges.length) * 100;

  return (
    <aside className="sidebar-shell">
      <div className="brand">
        <div className="brand-mark">
          <ShieldCheck size={22} />
        </div>
        <div>
          <strong className="brand-title">Cyber Training Lab</strong>
          <span className="muted">Lab d'entrainement</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Navigation principale">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            view === item.id ||
            (item.id === "tracks" && view === "track") ||
            (item.id === "challenges" && view === "challenge");
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${active ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className={active ? "text-[#00b8d9]" : ""} size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="progress-card">
        <span className="muted">Global progress</span>
        <strong className="brand-title">{completedCount}/{challenges.length}</strong>
        <div className="progress-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </aside>
  );
}
