import { ShieldCheck } from "lucide-react";
import { genericLabImage, roomImages } from "../../assets/images";
import { TagChip } from "../../components/ui/TagChip";
import { challenges } from "../../ctf/data";
import { getMethodology, trainingModes } from "../../ctf/selectors";

export function TaskPanel({
  room,
  runtime,
  roomStats,
  note,
  trainingMode,
  completedCount,
  onTrainingModeChange,
  onRevealHint,
  onNotesChange,
  onClearLogs,
  onReset,
}) {
  const isChallengeMode = trainingMode === "challenge";
  const hintVisible = !isChallengeMode && roomStats.hints > 0;

  return (
    <aside className="grid gap-4">
      <section className="overflow-hidden rounded-lg border border-[#314255] bg-[#101826] shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <div className="relative h-36">
          <img
            className="size-full object-cover"
            src={roomImages[room.id] || genericLabImage}
            alt=""
              loading="lazy"
              decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.72))]" />
        </div>
        <div className="p-4">
          <span className="block text-xs font-semibold uppercase tracking-normal text-[#9fb0c4]">
            Intelligence brief
          </span>
          <h2 className="m-0 mt-1 text-xl font-semibold text-[#e7edf5]">{room.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#9fb0c4]">{room.scenario}</p>
        </div>
      </section>

      <section className="rounded-lg border border-[#314255] bg-[#101826] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <span className="block text-xs font-semibold uppercase tracking-normal text-[#9fb0c4]">
          Training mode
        </span>
        <div className="mt-3 grid gap-2">
          {trainingModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`rounded-lg border p-3 text-left transition ${
                trainingMode === mode.id
                  ? "border-[#00b8d9]/60 bg-[#00b8d9]/10 text-[#e7edf5]"
                  : "border-[#314255] bg-[#080d13] text-[#9fb0c4] hover:border-[#40566f] hover:bg-[#1a2433]"
              }`}
              onClick={() => onTrainingModeChange(mode.id)}
            >
              <strong className="block text-sm text-[#e7edf5]">{mode.label}</strong>
              <span className="mt-1 block text-xs leading-5">{mode.description}</span>
            </button>
          ))}
        </div>
      </section>

      {!isChallengeMode && (
        <section className="rounded-lg border border-[#314255] bg-[#101826] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
          <span className="block text-xs font-semibold uppercase tracking-normal text-[#9fb0c4]">
            Methodology
          </span>
          <ol className="mt-3 grid list-decimal gap-2 pl-5 text-sm leading-6 text-[#c9d5e3]">
            {getMethodology(room).map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ol>
        </section>
      )}

      <section className="rounded-lg border border-[#314255] bg-[#101826] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <span className="block text-xs font-semibold uppercase tracking-normal text-[#9fb0c4]">
          Hints
        </span>
        {isChallengeMode ? (
          <p className="mt-2 text-sm leading-6 text-[#9fb0c4]">Hints are disabled in challenge mode.</p>
        ) : hintVisible ? (
          <>
            <p className="mt-2 text-sm leading-6 text-[#c9d5e3]">{room.hint}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(room.unlocks.length ? room.unlocks : ["basic shell"]).map((tool) => (
                <TagChip key={tool}>{tool}</TagChip>
              ))}
            </div>
          </>
        ) : (
          <button
            type="button"
            className="mt-3 inline-flex min-h-9 items-center justify-center rounded-lg border border-[#314255] bg-[#080d13] px-3 text-sm font-semibold text-[#e7edf5] transition hover:border-[#40566f] hover:bg-[#1a2433]"
            onClick={onRevealHint}
          >
            Reveal hint
          </button>
        )}
      </section>

      <section className="rounded-lg border border-[#314255] bg-[#101826] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <span className="block text-xs font-semibold uppercase tracking-normal text-[#9fb0c4]">
          Notes
        </span>
        <textarea
          className="mt-3 min-h-32 w-full resize-y rounded-lg border border-[#314255] bg-[#080d13] p-3 text-sm leading-6 text-[#e7edf5] outline-none placeholder:text-[#6f8196] focus:border-[#00b8d9]"
          value={note}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Commands, findings, credentials, blockers, things to retry..."
          aria-label="Room notes"
        />
      </section>

      <section className="rounded-lg border border-[#314255] bg-[#101826] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <div className="grid grid-cols-3 gap-2">
          <span className="rounded-lg border border-[#314255] bg-[#080d13] px-2 py-2 text-center text-xs text-[#9fb0c4]">{roomStats.commands} cmds</span>
          <span className="rounded-lg border border-[#314255] bg-[#080d13] px-2 py-2 text-center text-xs text-[#9fb0c4]">{roomStats.hints} hints</span>
          <span className="rounded-lg border border-[#314255] bg-[#080d13] px-2 py-2 text-center text-xs text-[#9fb0c4]">{roomStats.flagAttempts} flags</span>
        </div>
        <button
          type="button"
          className="mt-3 inline-flex min-h-9 w-full items-center justify-center rounded-lg border border-[#314255] bg-[#080d13] px-3 text-sm font-semibold text-[#e7edf5] transition hover:border-[#40566f] hover:bg-[#1a2433]"
          onClick={onClearLogs}
        >
          Clear terminal
        </button>
        <button
          type="button"
          className="mt-2 inline-flex min-h-9 w-full items-center justify-center rounded-lg border border-[#314255] bg-[#080d13] px-3 text-sm font-semibold text-[#ff8fa1] transition hover:border-[#ff3b5c]/60 hover:bg-[#1a2433]"
          onClick={onReset}
        >
          Reset progression
        </button>
        <div className="mt-3 rounded-lg border border-[#314255] bg-[#080d13] p-3">
          <span className="text-xs text-[#9fb0c4]">Global</span>
          <strong className="my-1.5 block text-[#e7edf5]">{completedCount}/{challenges.length}</strong>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-400/20">
            <span
              className="block h-full rounded-full bg-[#00b8d9]"
              style={{ width: `${(completedCount / challenges.length) * 100}%` }}
            />
          </div>
        </div>
        {runtime.solved && (
          <div className="mt-3 inline-flex w-full items-center gap-2 rounded-lg border border-[#00d97e]/40 bg-[#00d97e]/10 px-3 py-2 text-sm text-[#00d97e]">
            <ShieldCheck size={18} />
            <span>All rooms completed</span>
          </div>
        )}
      </section>
    </aside>
  );
}
