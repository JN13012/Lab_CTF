import { Clock, Lock, Play } from "lucide-react";
import { areaEmblems, getModuleImage, roomImages } from "../../assets/images";
import { GradeHeading } from "../../components/curriculum/GradeHeading";
import { ModuleAccordion, ModuleThumb } from "../../components/curriculum/ModuleAccordion";
import { getModuleNumber } from "../../ctf/data";
import {
  getCurrentLevel,
  getCurrentModule,
  getDomainRooms,
  getLevelStats,
  getModuleRooms,
  getModuleStatus,
  getRoomStatus,
  getRoomTaskProgress,
} from "../../ctf/selectors";

export function DashboardView({ runtime, onOpenRoom, onSetView }) {
  const level = getCurrentLevel(runtime);
  const levelStats = getLevelStats(runtime, level);
  const currentModule = getCurrentModule(runtime);
  const moduleRooms = getModuleRooms(currentModule);
  const currentRoom =
    moduleRooms.find((room) => getRoomStatus(runtime, room) === "available") || moduleRooms[0];
  const comingSoon = getRoomStatus(runtime, currentRoom) === "soon";
  const roomProgress = getRoomTaskProgress(runtime, currentRoom);
  const nextUnlock = levelStats.modules.find((module) => getModuleStatus(runtime, module) === "locked");
  const domainRooms = getDomainRooms(runtime);
  const completedRooms = domainRooms.filter((room) => runtime.completedRooms?.includes(room.id)).length;
  const solved = completedRooms > 0 && completedRooms === domainRooms.length;
  const started = roomProgress.answered > 0 || completedRooms > 0;
  const levelPercent = Math.round((completedRooms / domainRooms.length) * 100);
  const heroImage = roomImages[currentRoom.id] || getModuleImage(currentModule);
  const asideImage = getModuleImage(currentModule);

  return (
    <div className="grid gap-12">
      <section className="hud relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] panel">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="relative z-10 flex flex-col justify-center gap-6 p-8 lg:p-12">
            <div>
              <span className="kicker section-kicker text-[var(--accent)]">
                {comingSoon
                  ? "First room in production"
                  : solved
                    ? "Path completed"
                    : started
                      ? "Resume where you left off"
                      : "Start learning"}
              </span>
              <h1 className="m-0 mt-3 text-4xl font-extrabold leading-tight tracking-tight text-[var(--text)]">
                {solved ? "You finished every room" : currentRoom.title}
              </h1>
              <p className="m-0 mt-2 text-sm font-medium text-[var(--text-muted)]">
                {level.title} · Module {getModuleNumber(currentModule)}: {currentModule.title} · Room{" "}
                {currentModule.roomIds.indexOf(currentRoom.id) + 1} of {currentModule.roomIds.length}
              </p>
              <p className="m-0 mt-5 max-w-lg text-base leading-7 text-[var(--text-body)]">
                {solved
                  ? "Replay any room to sharpen your skills while new content is on its way."
                  : currentRoom.objective}
              </p>
            </div>

            {!solved && !comingSoon && (
              <div className="max-w-sm">
                <div className="mb-2 flex justify-between text-xs font-semibold text-[var(--text-muted)]">
                  <span>
                    {roomProgress.answered} of {roomProgress.total} questions answered
                  </span>
                  <span className="text-[var(--accent)]">{roomProgress.percent}%</span>
                </div>
                <div className="progress-bar">
                  <span style={{ width: `${roomProgress.percent}%` }} />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {comingSoon ? (
                <>
                  <button type="button" className="button min-h-12 px-7 text-[15px]" disabled>
                    <Clock size={17} />
                    Coming soon
                  </button>
                  <button type="button" className="button button-ghost min-h-12 px-5 text-[15px]" onClick={() => onSetView("tracks")}>
                    See the full path
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="button primary-button min-h-12 px-7 text-[15px]"
                  onClick={() => onOpenRoom(currentRoom.order, "dashboard")}
                >
                  <Play size={17} fill="currentColor" />
                  {started ? "Resume" : "Start"}
                </button>
              )}
            </div>
          </div>

          <div className="relative min-h-64 lg:min-h-full">
            {heroImage ? (
              <img src={heroImage} alt="" decoding="async" className="absolute inset-0 size-full object-cover" />
            ) : (
              <div
                className="absolute inset-0 grid place-items-center p-8"
                style={{ background: "radial-gradient(closest-side, var(--accent-soft), transparent)" }}
              >
                <img
                  src={areaEmblems[runtime.activeDomainId]}
                  alt=""
                  decoding="async"
                  className="max-h-[85%] w-auto max-w-[70%] object-contain"
                />
              </div>
            )}
            <div
              className="absolute inset-0 lg:hidden"
              style={{ background: "linear-gradient(180deg, var(--surface) 0%, transparent 40%)" }}
            />
            <div
              className="absolute inset-0 hidden lg:block"
              style={{ background: "linear-gradient(90deg, var(--surface) 0%, transparent 45%)" }}
            />
          </div>
        </div>
      </section>

      <section className="grid items-start gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="order-last overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] panel lg:order-none lg:sticky lg:top-[88px]">
          <div className="relative h-32">
            {asideImage ? (
              <img src={asideImage} alt="" decoding="async" className="size-full object-cover" />
            ) : (
              <ModuleThumb module={currentModule} />
            )}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(0deg, var(--surface) 0%, transparent 70%)" }}
            />
          </div>
          <div className="grid gap-6 p-6 pt-1">
            <div>
              <span className="kicker">Your progress</span>
              <div className="mt-2 flex items-baseline gap-2">
                <strong className="text-4xl font-extrabold text-[var(--text)]">{levelPercent}%</strong>
                <span className="text-sm text-[var(--text-muted)]">of {level.title}</span>
              </div>
              <div className="progress-bar mt-3">
                <span style={{ width: `${levelPercent}%` }} />
              </div>
            </div>
            <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[var(--border)] pt-5">
              <div>
                <dt className="text-xs text-[var(--text-muted)]">Rooms</dt>
                <dd className="m-0 mt-1 text-lg font-bold text-[var(--text)]">
                  {completedRooms}
                  <span className="text-sm font-medium text-[var(--text-faint)]"> / {domainRooms.length}</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--text-muted)]">Modules</dt>
                <dd className="m-0 mt-1 text-lg font-bold text-[var(--text)]">
                  {levelStats.completed}
                  <span className="text-sm font-medium text-[var(--text-faint)]"> / {levelStats.total}</span>
                </dd>
              </div>
            </dl>
            {nextUnlock && (
              <div className="border-t border-[var(--border)] pt-5">
                <span className="text-xs text-[var(--text-muted)]">Next unlock</span>
                <strong className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                  <Lock size={14} className="text-[var(--text-faint)]" />
                  {nextUnlock.title}
                </strong>
              </div>
            )}
          </div>
        </aside>

        <div>
          <div className="mb-7">
            <GradeHeading level={level} stats={levelStats} kicker="Your path" size="md" />
          </div>
          <ModuleAccordion runtime={runtime} level={level} onOpenRoom={onOpenRoom} backTarget="dashboard" />
        </div>
      </section>
    </div>
  );
}
