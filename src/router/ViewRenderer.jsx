import { DashboardView } from "../features/dashboard/DashboardView";
import { ProgressView } from "../features/progress/ProgressView";
import { RoomView } from "../features/room/RoomView";
import { TracksView } from "../features/tracks/TracksView";
import { views } from "./views";

export function ViewRenderer({
  view,
  runtime,
  searchQuery,
  activeRoom,
  activeRoomStats,
  activeRoomNote,
  visibleLogs,
  command,
  prompt,
  vmState,
  returnView,
  onSetView,
  onOpenRoom,
  onBoot,
  onStopVm,
  onRevealHint,
  onNotesChange,
  onCommandChange,
  onCommandSubmit,
  onAnswerQuestion,
  onReset,
}) {
  if (view === views.dashboard) {
    return <DashboardView runtime={runtime} onOpenRoom={onOpenRoom} onSetView={onSetView} />;
  }

  if (view === views.tracks) {
    return <TracksView runtime={runtime} searchQuery={searchQuery} onOpenRoom={onOpenRoom} />;
  }

  if (view === views.progress) {
    return <ProgressView runtime={runtime} onOpenRoom={onOpenRoom} onReset={onReset} />;
  }

  return (
    <RoomView
      room={activeRoom}
      runtime={runtime}
      logs={visibleLogs}
      command={command}
      prompt={prompt}
      vmState={vmState}
      roomStats={activeRoomStats}
      note={activeRoomNote}
      onBack={() => onSetView(returnView)}
      onBoot={onBoot}
      onStopVm={onStopVm}
      onRevealHint={onRevealHint}
      onNotesChange={onNotesChange}
      onCommandChange={onCommandChange}
      onCommandSubmit={onCommandSubmit}
      onAnswerQuestion={onAnswerQuestion}
    />
  );
}
