import { ArrowLeft } from "lucide-react";
import { genericLabImage, roomImages } from "../../assets/images";
import { TerminalView } from "../../components/terminal/TerminalView";
import { difficultyClass } from "../../components/ui/DifficultyBadge";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TagChip } from "../../components/ui/TagChip";
import { getDomainForRoom, getRoomStatus } from "../../ctf/selectors";
import { getSuggestedCommands } from "./commandSuggestions";
import { TaskPanel } from "./TaskPanel";
import { VmPanel } from "./VmPanel";

export function RoomView({
  room,
  runtime,
  logs,
  command,
  prompt,
  vmState,
  roomStats,
  note,
  trainingMode,
  completedCount,
  onBack,
  onBoot,
  onTrainingModeChange,
  onRevealHint,
  onNotesChange,
  onCommandChange,
  onCommandSubmit,
  onClearLogs,
  onReset,
}) {
  const domain = getDomainForRoom(room);
  const roomImage = roomImages[room.id] || genericLabImage;
  const roomStatus = getRoomStatus(runtime, room);
  const suggestedCommands = getSuggestedCommands(room, trainingMode);

  return (
    <section className="grid gap-4">
      <div className="relative grid min-h-[230px] overflow-hidden rounded-lg border border-[#314255] bg-[#101826] shadow-[0_18px_48px_rgba(0,0,0,0.28)] lg:grid-cols-[minmax(0,1fr)_220px]">
        <img
          className="absolute inset-0 size-full object-cover opacity-45"
          src={roomImage}
          alt=""
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#101826_0%,rgba(16,24,38,0.86)_44%,rgba(16,24,38,0.58)_100%),linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.42))]" />
        <div className="relative z-10 flex min-w-0 flex-col justify-end p-5">
          <button
            type="button"
            className="mb-8 inline-flex min-h-9 w-fit items-center gap-2 rounded-lg border border-[#314255] bg-[#101826] px-3 text-sm font-semibold text-[#e7edf5] transition hover:border-[#40566f] hover:bg-[#1a2433]"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            Back
          </button>
          <span className="block text-xs font-semibold uppercase tracking-normal text-[#9fb0c4]">
            Room workspace
          </span>
          <h2 className="m-0 mt-1 text-3xl font-semibold leading-tight text-[#e7edf5]">
            {room.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#c9d5e3]">
            {room.objective}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={difficultyClass[room.difficulty]}>{room.difficulty}</span>
            <TagChip>{domain?.title || room.category}</TagChip>
            <StatusBadge status={roomStatus} />
            <StatusBadge status={vmState}>VM {vmState}</StatusBadge>
            <TagChip>{trainingMode === "challenge" ? "Challenge mode" : "Guided mode"}</TagChip>
          </div>
        </div>
        <div className="relative z-10 grid gap-3 border-t border-[#314255] bg-[#080d13]/70 p-4 backdrop-blur lg:border-l lg:border-t-0">
          <div className="rounded-lg border border-[#314255] bg-[#101826]/80 p-3">
            <span className="block text-xs font-semibold uppercase text-[#9fb0c4]">Target</span>
            <strong className="mt-1 block text-[#e7edf5]">{room.targetIp || "local-sim"}</strong>
          </div>
          <div className="rounded-lg border border-[#314255] bg-[#101826]/80 p-3">
            <span className="block text-xs font-semibold uppercase text-[#9fb0c4]">Hints</span>
            <strong className="mt-1 block text-[#e7edf5]">{roomStats.hints}</strong>
          </div>
          <div className="rounded-lg border border-[#314255] bg-[#101826]/80 p-3">
            <span className="block text-xs font-semibold uppercase text-[#9fb0c4]">Attempts</span>
            <strong className="mt-1 block text-[#e7edf5]">{roomStats.flagAttempts}</strong>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[320px_minmax(0,1fr)_260px]">
        <TaskPanel
          room={room}
          runtime={runtime}
          roomStats={roomStats}
          note={note}
          trainingMode={trainingMode}
          completedCount={completedCount}
          onTrainingModeChange={onTrainingModeChange}
          onRevealHint={onRevealHint}
          onNotesChange={onNotesChange}
          onClearLogs={onClearLogs}
          onReset={onReset}
        />
        <TerminalView
          logs={logs}
          value={command}
          onChange={onCommandChange}
          onSubmit={onCommandSubmit}
          disabled={vmState !== "running"}
          prompt={prompt}
          suggestions={suggestedCommands}
          onUseSuggestion={onCommandChange}
        />
        <VmPanel room={room} vmState={vmState} onBoot={onBoot} />
      </div>
    </section>
  );
}
