import { Lock } from "lucide-react";
import { GradeHeading } from "../../components/curriculum/GradeHeading";
import { ModuleAccordion } from "../../components/curriculum/ModuleAccordion";
import { getDomainById } from "../../ctf/data";
import { getDomainLevels, getLevelStats } from "../../ctf/selectors";

export function TracksView({ runtime, searchQuery, onOpenRoom }) {
  const domainLevels = getDomainLevels(runtime);
  const grades = getDomainById(runtime.activeDomainId).grades || [];
  const activeGrade = domainLevels.at(0)?.title;

  return (
    <div className="grid gap-12">
      {grades.length > 0 && (
        <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0" aria-label="Grade ladder">
          {grades.map((grade, index) => {
            const available = domainLevels.some((level) => level.title === grade);
            const active = grade === activeGrade;
            return (
              <li key={grade} className="flex items-center gap-2">
                {index > 0 && <span className="h-px w-6 bg-[var(--border-strong)]" aria-hidden="true" />}
                <span
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]"
                      : "border-[var(--border)] text-[var(--text-muted)]"
                  }`}
                >
                  {grade}
                  {!available && <Lock size={12} className="text-[var(--text-faint)]" />}
                </span>
              </li>
            );
          })}
          <li className="ml-2 text-xs text-[var(--text-faint)]">Next grades coming soon</li>
        </ol>
      )}
      {domainLevels.map((level) => {
        const stats = getLevelStats(runtime, level);
        const percent = Math.round((stats.completed / stats.total) * 100);

        return (
          <section key={level.id}>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <GradeHeading level={level} stats={stats} />
                <p className="m-0 mt-5 text-[15px] leading-7 text-[var(--text-body)]">{level.summary}</p>
              </div>
              <div className="w-full max-w-xs">
                <div className="mb-2 flex justify-between text-xs font-semibold text-[var(--text-muted)]">
                  <span>
                    {stats.completed} of {stats.total} modules completed
                  </span>
                  <span className="text-[var(--accent)]">{percent}%</span>
                </div>
                <div className="progress-bar">
                  <span style={{ width: `${percent}%` }} />
                </div>
              </div>
            </div>
            <ModuleAccordion
              runtime={runtime}
              level={level}
              searchQuery={searchQuery}
              onOpenRoom={onOpenRoom}
              backTarget="tracks"
            />
          </section>
        );
      })}
    </div>
  );
}
