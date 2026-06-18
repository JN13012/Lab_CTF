import { RotateCcw, Search, ShieldCheck, X } from "lucide-react";

export function AppHeader({ viewTitle, runtime, searchQuery, onSearchChange, onReset }) {
  return (
    <header className="app-header">
      <div>
        <span className="kicker">Lab entrainement cybersecurite</span>
        <h1 className="page-title">{viewTitle}</h1>
      </div>
      <div className="header-actions">
        <div className="search-box">
          <Search size={16} />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search rooms"
            aria-label="Search rooms"
          />
          {searchQuery && (
            <button
              type="button"
              className="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          type="button"
          className="button"
          onClick={onReset}
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <div className="button">
          <ShieldCheck size={16} />
          <span>{runtime.solved ? "Complete" : "Training"}</span>
        </div>
      </div>
    </header>
  );
}
