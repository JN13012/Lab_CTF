import { challenges } from "../../ctf/data";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { getRoomStatus, roomMatchesSearch } from "../../ctf/selectors";

export function ProgressView({ runtime, completedCount, searchQuery, onOpenRoom }) {
  const visibleRooms = challenges.filter((room) => roomMatchesSearch(room, searchQuery));

  return (
    <section className="rounded-lg border border-[#314255] bg-[#101826] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-normal text-[#9fb0c4]">
            Progress
          </span>
          <h2 className="m-0 mt-1 text-2xl font-semibold text-[#e7edf5]">
            Training progression
          </h2>
        </div>
        <strong className="rounded-lg border border-[#314255] bg-[#080d13] px-3 py-2 text-sm text-[#e7edf5]">
          {completedCount}/{challenges.length}
        </strong>
      </div>
      <div className="mt-5 grid gap-2">
        {visibleRooms.map((room) => {
          const status = getRoomStatus(runtime, room);
          return (
            <button
              key={room.id}
              type="button"
              className={`grid min-h-14 grid-cols-[3rem_minmax(0,1fr)_8rem_auto] items-center gap-3 rounded-lg border border-[#314255] bg-[#080d13] p-3 text-left transition hover:border-[#40566f] hover:bg-[#1a2433] disabled:cursor-not-allowed disabled:opacity-50 ${
                status === "completed" ? "border-[#00d97e]/35" : ""
              }`}
              disabled={status === "locked"}
              onClick={() => onOpenRoom(room.order, "guided", "progress")}
            >
              <span className="text-xs font-semibold text-[#6f8196]">
                {String(room.order).padStart(2, "0")}
              </span>
              <strong className="text-sm text-[#e7edf5]">{room.title}</strong>
              <span className="text-xs text-[#9fb0c4]">{room.category}</span>
              <StatusBadge status={status} />
            </button>
          );
        })}
        {!visibleRooms.length && (
          <div className="grid min-h-24 place-items-center rounded-lg border border-dashed border-[#314255] p-4 text-center text-sm text-[#9fb0c4]">
            No room matches the current search.
          </div>
        )}
      </div>
    </section>
  );
}
