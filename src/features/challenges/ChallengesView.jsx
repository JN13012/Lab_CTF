import { useState } from "react";
import { Play } from "lucide-react";
import { genericLabImage, roomImages } from "../../assets/images";
import { difficultyClass } from "../../components/ui/DifficultyBadge";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { getStandaloneRoom, standaloneChallenges } from "../../ctf/data";
import {
  challengeMatchesSearch,
  getRoomStatus,
  normalize,
} from "../../ctf/selectors";

export function ChallengesView({ runtime, searchQuery, onOpenRoom }) {
  const [filter, setFilter] = useState("all");
  const visibleChallenges = standaloneChallenges.filter((challenge) => {
    const room = getStandaloneRoom(challenge);
    const status = room ? getRoomStatus(runtime, room) : "locked";
    const matchesFilter =
      filter === "all" ||
      normalize(challenge.category) === filter ||
      normalize(challenge.difficulty) === filter ||
      status === filter;

    return matchesFilter && challengeMatchesSearch(challenge, searchQuery);
  });

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {[
          ["all", "All challenges"],
          ["web", "Web"],
          ["soc", "SOC"],
          ["forensic", "Forensic"],
          ["hard", "Hard"],
          ["completed", "Completed"],
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

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {visibleChallenges.map((challenge) => {
          const room = getStandaloneRoom(challenge);
          const status = room ? getRoomStatus(runtime, room) : "locked";
          const available = room && status !== "locked";

          return (
            <article
              key={challenge.id}
              className={`grid overflow-hidden rounded-lg border border-[#314255] bg-[#101826] shadow-[0_18px_48px_rgba(0,0,0,0.28)] ${
                status === "locked" ? "opacity-65" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3 p-4 pb-0">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-normal text-[#9fb0c4]">
                    {challenge.category}
                  </span>
                  <h2 className="m-0 mt-1 text-xl font-semibold text-[#e7edf5]">
                    {challenge.title}
                  </h2>
                </div>
                <span className="shrink-0 rounded-lg border border-[#00b8d9]/30 bg-[#00b8d9]/10 px-2.5 py-1.5 text-xs font-bold text-[#7de8ff]">
                  {challenge.points} pts
                </span>
              </div>

              <div className="relative mx-4 mt-4 h-40 overflow-hidden rounded-lg border border-[#314255]">
                <img
                  className="size-full object-cover"
                  src={room ? roomImages[room.id] || genericLabImage : genericLabImage}
                  alt=""
              loading="lazy"
              decoding="async"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(0,0,0,0.62))]" />
              </div>

              <p className="m-0 p-4 pb-0 text-sm leading-6 text-[#9fb0c4]">
                {challenge.description}
              </p>

              <div className="flex flex-wrap gap-2 px-4 pt-4">
                <span className={difficultyClass[challenge.difficulty]}>
                  {challenge.difficulty}
                </span>
                <StatusBadge status={status} />
              </div>

              <div className="flex flex-wrap gap-2 px-4 pt-3">
                {challenge.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#314255] bg-[#080d13] px-2.5 py-1 text-xs text-[#9fb0c4]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="m-4 mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#00b8d9]/60 bg-[linear-gradient(135deg,#00b8d9,#4aa3ff)] px-3 text-sm font-extrabold text-[#061119] transition disabled:border-[#314255] disabled:bg-[#203047] disabled:bg-none disabled:text-[#6f8196]"
                disabled={!available}
                onClick={() => room && onOpenRoom(room.order, "challenge", "challenges")}
              >
                <Play size={17} />
                {status === "completed" ? "Review" : "Start challenge"}
              </button>
            </article>
          );
        })}
        {!visibleChallenges.length && (
          <div className="grid min-h-28 place-items-center rounded-lg border border-dashed border-[#314255] p-4 text-center text-sm text-[#9fb0c4] md:col-span-2 2xl:col-span-3">
            No challenge matches the current filters.
          </div>
        )}
      </div>
    </section>
  );
}
