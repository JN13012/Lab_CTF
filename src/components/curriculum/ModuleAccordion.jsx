import { useState } from "react";
import { Check, ChevronDown, Clock, Lock, Play, Trophy } from "lucide-react";
import { examImage, getModuleImage, roomImages } from "../../assets/images";
import { difficultyClass, difficultyLabel } from "../ui/DifficultyBadge";
import { moduleColors, moduleIcons } from "../ui/themeIcons";
import {
  getCurrentModule,
  getLevelStats,
  getModuleProgress,
  getModuleRooms,
  getModuleStatus,
  getMissingPrerequisites,
  getRoomPoints,
  getRoomStatus,
  roomMatchesSearch,
} from "../../ctf/selectors";

function RoomStatusIcon({ status, image }) {
  if (status === "soon" || !image) {
    const Icon = status === "soon" ? Clock : status === "completed" ? Check : status === "available" ? Play : Lock;
    return (
      <span
        className={`grid size-14 shrink-0 place-items-center rounded-full border-2 ${
          status === "soon" ? "border-dashed border-[var(--border-strong)] text-[var(--text-faint)]" : "border-[var(--accent)] text-[var(--accent)]"
        }`}
      >
        <Icon size={16} />
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[var(--accent)]">
        <img src={image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover opacity-40" />
        <span className="relative grid size-7 place-items-center rounded-full bg-[var(--accent)] text-[var(--on-accent)]">
          <Check size={16} strokeWidth={3.5} />
        </span>
      </span>
    );
  }
  if (status === "available") {
    return (
      <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[var(--accent)] shadow-[0_0_0_4px_var(--accent-soft)]">
        <img src={image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
        <span className="relative grid size-7 place-items-center rounded-full bg-[var(--page)]/80 text-[var(--accent)]">
          <Play size={13} fill="currentColor" />
        </span>
      </span>
    );
  }
  return (
    <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[var(--border-strong)]">
      <img src={image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover opacity-40 grayscale-[70%]" />
      <Lock size={15} className="relative text-[var(--text-faint)]" />
    </span>
  );
}

export function ModuleThumb({ module, dimmed }) {
  const image = getModuleImage(module);
  if (image) {
    return (
      <img
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        className={`size-full object-cover transition ${dimmed ? "opacity-60 grayscale-[70%]" : ""}`}
      />
    );
  }

  const Icon = moduleIcons[module.id];
  const color = moduleColors[module.id] || "var(--accent)";
  return (
    <span
      className="grid size-full place-items-center"
      style={{ color, background: `color-mix(in srgb, ${color} 12%, var(--surface-sunken))`, opacity: dimmed ? 0.75 : 1 }}
    >
      {Icon && <Icon size={26} strokeWidth={1.8} />}
    </span>
  );
}

export function ModuleAccordion({ runtime, level, searchQuery = "", onOpenRoom, backTarget }) {
  const stats = getLevelStats(runtime, level);
  const [openModuleId, setOpenModuleId] = useState(() => getCurrentModule(runtime).id);

  return (
    <div className="grid gap-4">
      {stats.modules.map((module, moduleIndex) => {
        const status = getModuleStatus(runtime, module);
        const progress = getModuleProgress(runtime, module);
        const missing = getMissingPrerequisites(runtime, module);
        const isOpen = openModuleId === module.id;
        const locked = status === "locked";
        const soon = status === "soon";
        const rooms = getModuleRooms(module).filter((room) => roomMatchesSearch(room, searchQuery));

        return (
          <article
            key={module.id}
            className={`overflow-hidden rounded-xl border bg-[var(--surface)] panel ${
              status === "available" ? "border-[var(--accent)]/40" : "border-[var(--border)]"
            }`}
          >
            <button
              type="button"
              className="flex w-full items-center gap-5 px-5 py-5 text-left transition hover:bg-[var(--surface-hover)]"
              onClick={() => setOpenModuleId(isOpen ? null : module.id)}
              aria-expanded={isOpen}
            >
              <span className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-[var(--border)]">
                <ModuleThumb module={module} dimmed={locked || soon} />
                {status === "completed" && (
                  <span className="absolute bottom-1 right-1 grid size-5 place-items-center rounded-full bg-[var(--accent)] text-[var(--on-accent)]">
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="block label-mono"
                  style={{ color: "var(--text-faint)" }}
                >
                  Module {String(moduleIndex + 1).padStart(2, "0")} · {progress.completed}/{progress.total} rooms
                </span>
                <strong className={`mt-1 block text-xl font-bold ${locked ? "text-[var(--text-body)]" : "text-[var(--text)]"}`}>
                  {module.title}
                </strong>
                <span className="mt-1 block text-sm leading-6 text-[var(--text-muted)]">{module.summary}</span>
              </span>
              {locked && missing.length > 0 && (
                <span className="hidden shrink-0 items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] md:inline-flex">
                  <Lock size={12} />
                  Unlocks after {missing[0].title}
                </span>
              )}
              {soon && <span className="status status-locked hidden shrink-0 md:inline-flex">Coming soon</span>}
              <ChevronDown
                size={22}
                className={`shrink-0 transition ${isOpen ? "rotate-180 text-[var(--accent)]" : "text-[var(--text-faint)]"}`}
              />
            </button>

            {isOpen && (
              <div className="reveal grid gap-1 px-5 pb-5">
                {locked && missing.length > 0 && (
                  <p className="m-0 mb-2 flex items-center gap-2 rounded-lg bg-[var(--surface-sunken)] px-4 py-3 text-sm text-[var(--text-muted)]">
                    <Lock size={14} />
                    Complete {missing.map((item) => item.title).join(", ")} to unlock this module.
                  </p>
                )}
                {rooms.map((room) => {
                  const roomStatus = getRoomStatus(runtime, room);
                  const roomLocked = roomStatus === "locked" || roomStatus === "soon";
                  return (
                    <button
                      key={room.id}
                      type="button"
                      disabled={roomLocked}
                      onClick={() => onOpenRoom(room.order, backTarget)}
                      className="flex items-center gap-5 rounded-lg px-3 py-3 text-left transition enabled:hover:bg-[var(--surface-hover)] disabled:cursor-default"
                    >
                      <RoomStatusIcon status={roomStatus} image={roomImages[room.id]} />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <strong className={`text-[17px] font-semibold ${roomLocked ? "text-[var(--text-muted)]" : "text-[var(--text)]"}`}>
                            {room.title}
                          </strong>
                          <span className={difficultyClass[room.difficulty]}>{difficultyLabel[room.difficulty]}</span>
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-[var(--text-muted)]">{room.objective}</span>
                      </span>
                      <span
                        className={`hidden shrink-0 items-center gap-1 text-sm font-bold sm:inline-flex ${
                          roomStatus === "completed" ? "text-[var(--accent)]" : "text-[var(--text-faint)]"
                        }`}
                      >
                        <Trophy size={13} />
                        {roomStatus === "completed" ? `+${getRoomPoints(room)}` : getRoomPoints(room)}
                      </span>
                    </button>
                  );
                })}
                {!rooms.length && (
                  <p className="m-0 px-3 py-2 text-sm text-[var(--text-muted)]">No room matches your search.</p>
                )}
              </div>
            )}
          </article>
        );
      })}

      <article className="flex items-center gap-5 rounded-xl border border-dashed border-[var(--border-strong)] px-5 py-5">
        <span className="size-16 shrink-0 overflow-hidden rounded-xl border border-[var(--border)]">
          <img src={examImage} alt="" loading="lazy" decoding="async" className="size-full object-cover opacity-40 grayscale" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block label-mono text-[var(--warning)]">
            Final step
          </span>
          <strong className="mt-1 block text-xl font-bold text-[var(--text)]">{level.exam.title}</strong>
          <span className="mt-1 block text-sm leading-6 text-[var(--text-muted)]">{level.exam.summary}</span>
        </span>
        <span className="status status-locked shrink-0">Coming soon</span>
      </article>
    </div>
  );
}
