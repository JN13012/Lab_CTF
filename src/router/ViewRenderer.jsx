import { ChallengesView } from "../features/challenges/ChallengesView";
import { DashboardView } from "../features/dashboard/DashboardView";
import { ProgressView } from "../features/progress/ProgressView";
import { RoomView } from "../features/room/RoomView";
import { TrackDetailView } from "../features/tracks/TrackDetailView";
import { TracksView } from "../features/tracks/TracksView";
import { views } from "./views";

export function ViewRenderer({
  view,
  runtime,
  completedCount,
  searchQuery,
  selectedDomainId,
  activeRoom,
  activeRoomStats,
  activeRoomNote,
  visibleLogs,
  command,
  prompt,
  vmState,
  returnView,
  onSetView,
  onSelectDomain,
  onOpenTrack,
  onOpenRoom,
  onBoot,
  onTrainingModeChange,
  onRevealHint,
  onNotesChange,
  onCommandChange,
  onCommandSubmit,
  onClearLogs,
  onReset,
}) {
  if (view === views.dashboard) {
    return (
      <DashboardView
        runtime={runtime}
        completedCount={completedCount}
        searchQuery={searchQuery}
        selectedDomainId={selectedDomainId}
        onOpenTrack={onOpenTrack}
        onOpenRoom={onOpenRoom}
      />
    );
  }

  if (view === views.tracks) {
    return (
      <TracksView
        runtime={runtime}
        selectedDomainId={selectedDomainId}
        searchQuery={searchQuery}
        onSelectDomain={onSelectDomain}
      />
    );
  }

  if (view === views.track) {
    return (
      <TrackDetailView
        runtime={runtime}
        domainId={selectedDomainId}
        searchQuery={searchQuery}
        onBack={() => onSetView(views.tracks)}
        onOpenRoom={onOpenRoom}
      />
    );
  }

  if (view === views.challenges) {
    return (
      <ChallengesView
        runtime={runtime}
        searchQuery={searchQuery}
        onOpenRoom={onOpenRoom}
      />
    );
  }

  if (view === views.progress) {
    return (
      <ProgressView
        runtime={runtime}
        completedCount={completedCount}
        searchQuery={searchQuery}
        onOpenRoom={onOpenRoom}
      />
    );
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
      trainingMode={runtime.trainingMode || "guided"}
      completedCount={completedCount}
      onBack={() => onSetView(returnView)}
      onBoot={onBoot}
      onTrainingModeChange={onTrainingModeChange}
      onRevealHint={onRevealHint}
      onNotesChange={onNotesChange}
      onCommandChange={onCommandChange}
      onCommandSubmit={onCommandSubmit}
      onClearLogs={onClearLogs}
      onReset={onReset}
    />
  );
}
