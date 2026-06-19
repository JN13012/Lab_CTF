import { ArrowLeft, CheckCircle2, CircleDot, Lock, Server } from "lucide-react";
import { domainImages, genericLabImage, roomImages } from "../../assets/images";
import { difficultyClass } from "../../components/ui/DifficultyBadge";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TagChip } from "../../components/ui/TagChip";
import { domainCatalog } from "../../ctf/data";
import {
  getDomainStats,
  getRoomStatus,
  roomMatchesSearch,
} from "../../ctf/selectors";
import { domainIcons } from "./TracksView";

export function TrackDetailView({ runtime, domainId, searchQuery, onBack, onOpenRoom }) {
  const domain = domainCatalog.find((item) => item.id === domainId) || domainCatalog[0];
  const Icon = domainIcons[domain.id] || Server;
  const stats = getDomainStats(runtime, domain);
  const visibleRooms = stats.rooms.filter((room) => roomMatchesSearch(room, searchQuery));

  return (
    <section className="grid gap-4">
      <button
        type="button"
        className="inline-flex min-h-9 w-fit items-center gap-2 rounded-lg border border-[#314255] bg-[#101826] px-3 text-sm font-semibold text-[#e7edf5] transition hover:border-[#40566f] hover:bg-[#1a2433]"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        Back to programs
      </button>

      <div className="grid overflow-hidden rounded-lg border border-[#314255] bg-[#101826] shadow-[0_18px_48px_rgba(0,0,0,0.28)] lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="relative min-h-56">
          <img
            className="absolute inset-0 size-full object-cover"
            src={domainImages[domain.id] || genericLabImage}
            alt=""
              loading="lazy"
              decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.68))]" />
          <div className="absolute bottom-4 left-4 grid size-16 place-items-center rounded-lg border border-[#00b8d9]/30 bg-[#00b8d9]/10 text-[#00b8d9] backdrop-blur">
            <Icon size={32} />
          </div>
        </div>
        <div className="flex flex-col justify-center p-5">
          <span className="block text-xs font-semibold uppercase tracking-normal text-[#9fb0c4]">
            Training program
          </span>
          <h2 className="m-0 mt-1 text-3xl font-semibold leading-tight text-[#e7edf5]">
            {domain.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#9fb0c4]">
            {domain.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <TagChip>{stats.rooms.length} rooms</TagChip>
            <TagChip>{stats.completed} completed</TagChip>
            <TagChip>{stats.percent}% progress</TagChip>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#314255] bg-[#101826] shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <div className="hidden grid-cols-[minmax(0,1fr)_8rem_8rem_6rem] gap-3 border-b border-[#314255] bg-[#080d13] px-4 py-3 text-xs font-semibold uppercase text-[#9fb0c4] md:grid">
          <span>Room</span>
          <span>Difficulty</span>
          <span>Status</span>
          <span />
        </div>
        {visibleRooms.map((room) => {
          const status = getRoomStatus(runtime, room);
          const StatusIcon =
            status === "completed" ? CheckCircle2 : status === "locked" ? Lock : CircleDot;

          return (
            <div
              key={room.id}
              className={`grid gap-3 border-b border-[#314255] p-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_8rem_8rem_6rem] md:items-center ${
                status === "locked" ? "opacity-60" : ""
              }`}
            >
              <div className="grid min-w-0 grid-cols-[48px_minmax(0,1fr)] gap-3">
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
              </div>
              <span className={difficultyClass[room.difficulty]}>{room.difficulty}</span>
              <StatusBadge status={status} />
              <button
                type="button"
                className="inline-flex min-h-8 items-center justify-center rounded-lg border border-[#314255] bg-[#080d13] px-3 text-xs font-semibold text-[#e7edf5] transition hover:border-[#40566f] hover:bg-[#1a2433] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={status === "locked"}
                onClick={() => onOpenRoom(room.order, "guided", "track")}
              >
                {status === "completed" ? "Review" : "Start"}
              </button>
            </div>
          );
        })}
        {!visibleRooms.length && (
          <div className="grid min-h-24 place-items-center p-4 text-center text-sm text-[#9fb0c4]">
            No room matches the current search.
          </div>
        )}
      </div>
    </section>
  );
}
