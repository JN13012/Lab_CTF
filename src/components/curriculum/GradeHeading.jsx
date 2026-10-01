import { ChevronsUp } from "lucide-react";

export function GradeHeading({ level, stats, kicker = "Current grade", size = "lg" }) {
  const rooms = stats.modules.reduce((total, module) => total + module.roomIds.length, 0);
  const hours = stats.modules.reduce((total, module) => total + module.estimatedHours, 0);
  const large = size === "lg";

  return (
    <div className="flex items-center gap-5">
      <span className="grade-emblem" aria-hidden="true">
        <ChevronsUp size={26} strokeWidth={2.6} />
      </span>
      <div className="min-w-0">
        <span className="kicker section-kicker">{kicker}</span>
        <h2 className={`m-0 mt-1.5 font-bold leading-none text-[var(--text)] ${large ? "text-4xl" : "text-3xl"}`}>
          {level.title}
        </h2>
        <p className="m-0 mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-body)]">{level.subtitle}</span>
          <span className="text-[var(--text-faint)]" aria-hidden="true">/</span>
          <span>{stats.total} modules</span>
          <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>
          <span>{rooms} rooms</span>
          <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>
          <span>{hours} h</span>
        </p>
      </div>
    </div>
  );
}
