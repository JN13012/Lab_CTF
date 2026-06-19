import { useState } from "react";
import {
  Activity,
  Bug,
  CheckCircle2,
  CircleDot,
  Database,
  Lock,
  FlaskConical,
  Network,
  Radar,
  Server,
  Shield,
} from "lucide-react";
import { domainImages, genericLabImage, roomImages } from "../../assets/images";
import { difficultyClass } from "../../components/ui/DifficultyBadge";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { domainCatalog, getDomainChallenges } from "../../ctf/data";
import {
  domainMatchesSearch,
  getDomainStats,
  getRoomStatus,
  roomMatchesSearch,
} from "../../ctf/selectors";

const domainIcons = {
  recon: Network,
  web: Bug,
  cracking: Database,
  exploitation: FlaskConical,
  soc: Radar,
  forensic: Activity,
  hardening: Shield,
};

export function TracksView({ runtime, selectedDomainId, searchQuery, onSelectDomain, onOpenRoom }) {
  const [filter, setFilter] = useState("all");
  const [openDomainId, setOpenDomainId] = useState(selectedDomainId || domainCatalog[0].id);
  const visibleDomains = domainCatalog.filter((domain) => {
    const stats = getDomainStats(runtime, domain);
    const rooms = getDomainChallenges(domain);
    const hasHardRoom = rooms.some((room) => room.difficulty === "Hard");
    const matchesFilter =
      filter === "all" ||
      (filter === "available" && stats.percent < 100) ||
      (filter === "completed" && stats.percent === 100) ||
      (filter === "hard" && hasHardRoom);

    return matchesFilter && domainMatchesSearch(domain, searchQuery);
  });

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {[
          ["all", "All programs"],
          ["available", "Available"],
          ["completed", "Completed"],
          ["hard", "Hard"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`inline-flex min-h-9 items-center rounded-full border px-3 text-sm font-semibold transition ${
              filter === id
                ? "border-[#00b8d9]/60 bg-[#00b8d9]/10 text-[#7de8ff]"
                : "border-[#314255] bg-[#101826] text-[#9fb0c4] hover:border-[#40566f] hover:text-[#e7edf5]"
            }`}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {visibleDomains.map((domain) => {
          const Icon = domainIcons[domain.id] || Server;
          const stats = getDomainStats(runtime, domain);
          const isOpen = openDomainId === domain.id;
          const visibleRooms = stats.rooms.filter((room) => roomMatchesSearch(room, searchQuery));

          return (
            <article
              key={domain.id}
              className={`overflow-hidden rounded-lg border bg-[#101826] shadow-[0_18px_48px_rgba(0,0,0,0.28)] ${
                isOpen ? "border-[#00b8d9]/45" : "border-[#314255]"
              }`}
            >
              <button
                type="button"
                className="grid w-full items-center gap-4 p-4 text-left transition hover:bg-[#1a2433] lg:grid-cols-[156px_3rem_minmax(0,1fr)_160px]"
                onClick={() => {
                  onSelectDomain(domain.id);
                  setOpenDomainId(isOpen ? "" : domain.id);
                }}
              >
                <div className="h-28 overflow-hidden rounded-lg border border-[#314255]">
                  <img
                    className="size-full object-cover"
                    src={domainImages[domain.id] || genericLabImage}
                    alt=""
              loading="lazy"
              decoding="async"
                  />
                </div>
                <div className="grid size-12 place-items-center rounded-lg border border-[#00b8d9]/30 bg-[#00b8d9]/10 text-[#00b8d9]">
                  <Icon size={24} />
                </div>
                <div className="min-w-0">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-normal text-[#9fb0c4]">
                      {stats.rooms.length} rooms
                    </span>
                    <h2 className="m-0 mt-1 text-xl font-semibold text-[#e7edf5]">
                      {domain.title}
                    </h2>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#9fb0c4]">{domain.description}</p>
                </div>
                <div>
                  <strong className="block text-lg text-[#e7edf5]">{stats.percent}%</strong>
                  <span className="text-xs text-[#9fb0c4]">complete</span>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-400/20">
                    <span
                      className="block h-full rounded-full bg-[#00b8d9]"
                      style={{ width: `${stats.percent}%` }}
                    />
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="grid gap-2 border-t border-[#314255] bg-[#080d13] p-3">
                  {visibleRooms.map((room) => {
                    const status = getRoomStatus(runtime, room);
                    const StatusIcon = status === "completed" ? CheckCircle2 : status === "locked" ? Lock : CircleDot;

                    return (
                      <button
                        key={room.id}
                        type="button"
                        className="grid min-h-16 grid-cols-[48px_minmax(0,1fr)_auto_auto_auto] items-center gap-3 rounded-lg border border-[#314255] bg-[#101826] p-3 text-left transition hover:border-[#40566f] hover:bg-[#1a2433] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={status === "locked"}
                        onClick={() => onOpenRoom(room.order, "guided", "tracks")}
                      >
                        <div className="relative size-12 overflow-hidden rounded-lg border border-[#314255]">
                          <img
                            className="size-full object-cover"
                            src={roomImages[room.id] || genericLabImage}
                            alt=""
              loading="lazy"
              decoding="async"
                          />
                          <StatusIcon className="absolute bottom-1 right-1 text-[#00b8d9]" size={16} />
                        </div>
                        <div className="min-w-0">
                          <strong className="block text-sm text-[#e7edf5]">{room.title}</strong>
                          <span className="mt-1 line-clamp-2 block text-xs leading-5 text-[#9fb0c4]">
                            {room.objective}
                          </span>
                        </div>
                        <span className={difficultyClass[room.difficulty]}>{room.difficulty}</span>
                        <StatusBadge status={status} />
                        <span className="inline-flex min-h-8 items-center rounded-lg border border-[#314255] px-3 text-xs font-semibold text-[#e7edf5]">
                          Start
                        </span>
                      </button>
                    );
                  })}
                  {!visibleRooms.length && (
                    <div className="grid min-h-24 place-items-center rounded-lg border border-dashed border-[#314255] p-4 text-center text-sm text-[#9fb0c4]">
                      No room matches the current search.
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
        {!visibleDomains.length && (
          <div className="grid min-h-28 place-items-center rounded-lg border border-dashed border-[#314255] p-4 text-center text-sm text-[#9fb0c4]">
            No learning path matches the current filters.
          </div>
        )}
      </div>
    </section>
  );
}

export { domainIcons };
