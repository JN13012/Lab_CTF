import { Check, Lock, Play, RotateCcw, Trophy } from "lucide-react";
import { difficultyLabel } from "../../components/ui/DifficultyBadge";
import { moduleColors, moduleMarkers } from "../../components/ui/themeIcons";
import { getModuleForRoom, getModuleNumber } from "../../ctf/data";
import {
  getDomainLevels,
  getDomainRooms,
  getLevelStats,
  getModuleProgress,
  getModuleRooms,
  getRank,
  getRoomPoints,
  getRoomStatus,
  getTotalPoints,
} from "../../ctf/selectors";

const markerPaths = {
  circle: <circle cx="12" cy="12" r="9" />,
  diamond: <path d="M12 2.5 21.5 12 12 21.5 2.5 12Z" />,
  hexagon: <path d="M12 2.5 20.2 7.25v9.5L12 21.5l-8.2-4.75v-9.5Z" />,
};

function Marker({ shape, color, status }) {
  const locked = status === "locked" || status === "soon";
  const done = status === "completed";
  const stroke = locked ? "var(--border-strong)" : color;
  return (
    <span className="relative grid size-7 shrink-0 place-items-center">
      <svg viewBox="0 0 24 24" className="absolute inset-0 size-full" aria-hidden="true">
        <g
          fill={done ? color : "var(--page)"}
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        >
          {markerPaths[shape]}
        </g>
      </svg>
      {done && <Check size={12} strokeWidth={3.5} className="relative text-[var(--on-accent)]" />}
      {locked && <Lock size={10} className="relative text-[var(--text-faint)]" />}
      {status === "available" && <span className="relative size-2 rounded-full" style={{ background: color }} />}
    </span>
  );
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function ProgressView({ runtime, onOpenRoom, onReset }) {
  const points = getTotalPoints(runtime);
  const { current: rank, next: nextRank } = getRank(points);
  const domainRooms = getDomainRooms(runtime);
  const completedRooms = domainRooms.filter((room) => runtime.completedRooms?.includes(room.id)).length;
  const nextRoom = domainRooms.find((room) => getRoomStatus(runtime, room) === "available");
  const nextModule = nextRoom ? getModuleForRoom(nextRoom.id) : null;
  const allComingSoon = domainRooms.every((room) => getRoomStatus(runtime, room) === "soon");

  return (
    <div className="grid gap-12">
      {getDomainLevels(runtime).map((level) => {
        const stats = getLevelStats(runtime, level);
        const percent = Math.round((completedRooms / domainRooms.length) * 100);

        return (
          <div key={level.id} className="grid gap-10">
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] panel p-5">
                <span className="kicker">{level.title} · {level.subtitle}</span>
                <strong className="mt-3 block text-3xl font-extrabold text-[var(--text)]">{percent}%</strong>
                <span className="mt-1 block text-sm text-[var(--text-muted)]">
                  {completedRooms} of {domainRooms.length} rooms · {stats.completed} of {stats.total} modules
                </span>
                <div className="progress-bar mt-4">
                  <span style={{ width: `${percent}%` }} />
                </div>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] panel p-5">
                <span className="kicker">Rank</span>
                <strong className="mt-3 block text-3xl font-extrabold text-[var(--accent)]">{rank.name}</strong>
                <span className="mt-1 inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                  <Trophy size={14} className="text-[var(--warning)]" />
                  {points} pts
                  {nextRank && ` · ${nextRank.minPoints - points} pts to ${nextRank.name}`}
                </span>
              </div>
              <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] panel p-5">
                <span className="kicker">Next up</span>
                {nextRoom ? (
                  <>
                    <strong className="mt-3 block text-lg font-bold text-[var(--text)]">{nextRoom.title}</strong>
                    <span className="mt-1 block text-sm text-[var(--text-muted)]">
                      Module {getModuleNumber(nextModule)}: {nextModule.title}
                    </span>
                    <button
                      type="button"
                      className="button primary-button mt-4 w-fit"
                      onClick={() => onOpenRoom(nextRoom.order, "progress")}
                    >
                      <Play size={15} fill="currentColor" />
                      Open room
                    </button>
                  </>
                ) : (
                  <strong className="mt-3 block text-lg font-bold text-[var(--text)]">
                    {allComingSoon ? "First rooms coming soon" : "Every room is completed"}
                  </strong>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] panel p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="m-0 text-xl font-bold text-[var(--text)]">Timeline</h2>
                <div className="flex flex-wrap gap-5">
                  {stats.modules.map((module) => (
                    <span key={module.id} className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
                      <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
                        <g fill={moduleColors[module.id]}>{markerPaths[moduleMarkers[module.id]]}</g>
                      </svg>
                      {module.title}
                    </span>
                  ))}
                </div>
              </div>

              <ol className="m-0 mt-8 list-none p-0">
                {stats.modules.map((module, moduleIndex) => {
                  const progress = getModuleProgress(runtime, module);
                  const color = moduleColors[module.id];
                  const shape = moduleMarkers[module.id];

                  return (
                    <li key={module.id} className="relative pb-6">
                      <div className="mb-3 flex items-baseline gap-3 pl-11">
                        <span className="label-mono" style={{ color }}>
                          Module {moduleIndex + 1}
                        </span>
                        <strong className="text-base font-bold text-[var(--text)]">{module.title}</strong>
                        <span className="text-xs text-[var(--text-muted)]">
                          {progress.completed}/{progress.total}
                        </span>
                      </div>

                      <ol className="m-0 list-none p-0">
                        {getModuleRooms(module).map((room, roomIndex) => {
                          const status = getRoomStatus(runtime, room);
                          const completedAt = runtime.completedAt?.[room.id];
                          return (
                            <li key={room.id} className="relative flex gap-4 pb-2">
                              <span
                                className="absolute bottom-0 left-[13px] top-7 w-0.5"
                                style={{ background: status === "completed" ? color : "var(--border)" }}
                              />
                              <Marker shape={shape} color={color} status={status} />
                              <button
                                type="button"
                                disabled={status === "locked" || status === "soon"}
                                onClick={() => onOpenRoom(room.order, "progress")}
                                className="mb-2 flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-3 py-2 text-left transition enabled:hover:bg-[var(--surface-hover)] disabled:cursor-default"
                              >
                                <span className="min-w-0 flex-1">
                                  <strong
                                    className={`block text-[15px] font-semibold ${
                                      status === "locked" || status === "soon" ? "text-[var(--text-muted)]" : "text-[var(--text)]"
                                    }`}
                                  >
                                    {room.title}
                                  </strong>
                                  <span className="text-xs text-[var(--text-faint)]">
                                    Room {roomIndex + 1} · {difficultyLabel[room.difficulty]}
                                  </span>
                                </span>
                                <span className="text-xs text-[var(--text-muted)]">
                                  {status === "completed"
                                    ? completedAt
                                      ? `Completed ${formatDate(completedAt)}`
                                      : "Completed"
                                    : status === "available"
                                      ? "In progress"
                                      : status === "soon"
                                        ? "Coming soon"
                                        : "Locked"}
                                </span>
                                <span
                                  className={`w-14 text-right text-sm font-bold ${
                                    status === "completed" ? "text-[var(--accent)]" : "text-[var(--text-faint)]"
                                  }`}
                                >
                                  {status === "completed" ? `+${getRoomPoints(room)}` : getRoomPoints(room)}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    </li>
                  );
                })}

                <li className="flex items-center gap-4">
                  <span className="grid size-7 shrink-0 place-items-center rounded-md border-2 border-dashed border-[var(--border-strong)] text-[var(--text-faint)]">
                    <Trophy size={13} />
                  </span>
                  <span className="px-3">
                    <strong className="block text-[15px] font-semibold text-[var(--text-muted)]">{level.exam.title}</strong>
                    <span className="text-xs text-[var(--text-faint)]">Final step · coming soon</span>
                  </span>
                </li>
              </ol>
            </section>
          </div>
        );
      })}

      <section className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-8">
        <div>
          <strong className="block text-sm font-semibold text-[var(--text)]">Reset progress</strong>
          <span className="text-sm text-[var(--text-muted)]">Clears completed rooms, answers, notes and points in this browser.</span>
        </div>
        <button type="button" className="button" onClick={onReset}>
          <RotateCcw size={15} className="text-[var(--danger)]" />
          Reset progress
        </button>
      </section>
    </div>
  );
}
