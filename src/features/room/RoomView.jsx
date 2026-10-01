import { ArrowLeft, Boxes, ChevronRight, ListChecks, Trophy } from "lucide-react";
import { TerminalView } from "../../components/terminal/TerminalView";
import { difficultyClass, difficultyLabel } from "../../components/ui/DifficultyBadge";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { moduleColors, moduleIcons } from "../../components/ui/themeIcons";
import { getModuleForRoom, getModuleNumber, levels } from "../../ctf/data";
import { getRoomPoints, getRoomStatus, getRoomTaskProgress, getRoomTasks } from "../../ctf/selectors";
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
  onBack,
  onBoot,
  onStopVm,
  onRevealHint,
  onNotesChange,
  onCommandChange,
  onCommandSubmit,
  onAnswerQuestion,
}) {
  const module = getModuleForRoom(room.id);
  const level = levels.find((item) => item.id === module?.levelId);
  const moduleNumber = getModuleNumber(module);
  const roomNumber = (module?.roomIds.indexOf(room.id) ?? -1) + 1;
  const roomStatus = getRoomStatus(runtime, room);
  const progress = getRoomTaskProgress(runtime, room);
  const taskCount = getRoomTasks(room).length;
  const suggestedCommands = getSuggestedCommands(room);
  const Icon = moduleIcons[module?.id] || Boxes;
  const color = moduleColors[module?.id] || "var(--accent)";

  return (
    <section className="grid gap-5">
      <div className="hud relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] panel p-6">
        <div
          className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full blur-3xl"
          style={{ background: `color-mix(in srgb, ${color} 14%, transparent)` }}
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)]">
            <button type="button" className="inline-flex items-center gap-1 hover:text-[var(--accent)]" onClick={onBack}>
              <ArrowLeft size={14} />
              Back
            </button>
            <span className="text-[var(--text-faint)]">|</span>
            <span>{level?.title}</span>
            <ChevronRight size={13} className="text-[var(--text-faint)]" />
            <span className="text-[var(--text-body)]">
              Module {moduleNumber}: {module?.title}
            </span>
            <ChevronRight size={13} className="text-[var(--text-faint)]" />
            <span>
              Room {roomNumber} of {module?.roomIds.length}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-6">
            <div className="flex min-w-0 flex-1 items-start gap-5">
              <span
                className="grid size-16 shrink-0 place-items-center rounded-xl border"
                style={{
                  color,
                  borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
                  background: `color-mix(in srgb, ${color} 12%, transparent)`,
                }}
              >
                <Icon size={30} />
              </span>
              <div className="min-w-0">
                <h2 className="m-0 text-3xl font-bold tracking-tight text-[var(--text)]">{room.title}</h2>
                <p className="m-0 mt-2 max-w-3xl text-[15px] leading-relaxed text-[var(--text-body)]">{room.objective}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={difficultyClass[room.difficulty]}>{difficultyLabel[room.difficulty]}</span>
                  <span className="chip">
                    <ListChecks size={12} />
                    {taskCount} tasks
                  </span>
                  <span className="chip">
                    <Trophy size={12} />
                    {getRoomPoints(room)} pts
                  </span>
                  <StatusBadge status={roomStatus} />
                </div>
              </div>
            </div>
            <div className="w-full max-w-xs">
              <div className="mb-1.5 flex justify-between text-xs font-semibold text-[var(--text-muted)]">
                <span>
                  {progress.answered} of {progress.total} questions answered
                </span>
                <span className="text-[var(--accent)]">{progress.percent}%</span>
              </div>
              <div className="progress-bar">
                <span style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <VmPanel room={room} vmState={vmState} onBoot={onBoot} onStop={onStopVm} />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <TaskPanel
          room={room}
          runtime={runtime}
          vmState={vmState}
          roomStats={roomStats}
          note={note}
          onRevealHint={onRevealHint}
          onNotesChange={onNotesChange}
          onAnswerQuestion={onAnswerQuestion}
        />
        <div className="order-first xl:sticky xl:top-[88px] xl:order-none">
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
        </div>
      </div>
    </section>
  );
}
