import { Play } from "lucide-react";
import {
  domainImages,
  genericLabImage,
  heroImage,
  roomImages,
} from "../../assets/images";
import { difficultyClass } from "../../components/ui/DifficultyBadge";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TagChip } from "../../components/ui/TagChip";
import {
  challenges,
  domainCatalog,
  getChallengeById,
} from "../../ctf/data";
import {
  getDomainForRoom,
  getDomainStats,
  getRoomStatus,
  roomMatchesSearch,
} from "../../ctf/selectors";

export function DashboardView({
  runtime,
  completedCount,
  searchQuery,
  selectedDomainId,
  onOpenTrack,
  onOpenRoom,
}) {
  const activeRoom = getChallengeById(runtime.activeRoomId) || challenges[0];
  const currentRoom =
    runtime.completedRooms?.includes(activeRoom.id)
      ? challenges.find((room) => getRoomStatus(runtime, room) === "available") || activeRoom
      : activeRoom;
  const currentDomain = getDomainForRoom(currentRoom);
  const globalProgress = Math.round((completedCount / challenges.length) * 100);
  const selectedDomain =
    domainCatalog.find((domain) => domain.id === selectedDomainId) ||
    currentDomain ||
    domainCatalog[0];
  const selectedStats = getDomainStats(runtime, selectedDomain);
  const visibleSelectedRooms = selectedStats.rooms.filter((room) =>
    roomMatchesSearch(room, searchQuery),
  );
  return (
    <div className="dashboard-grid">
      <section className="hero-card">
        <img className="hero-bg" src={heroImage} alt="" />
        <div className="hero-content">
          <div className="hero-main">
            <div className="hero-progress">
              <span className="kicker">Current path</span>
              <strong>{currentDomain?.title || "Core training"}</strong>
              <small className="muted">{globalProgress}% global completion</small>
              <div className="progress-bar">
                <span style={{ width: `${globalProgress}%` }} />
              </div>
            </div>

            <span className="kicker">Continue training</span>
            <h2 className="hero-title">{runtime.solved ? "Track completed" : currentRoom.title}</h2>
            <p className="hero-text">
              {runtime.solved
                ? "All rooms are completed. Reset progression or replay a challenge for rehearsal."
                : currentRoom.objective}
            </p>

            <div className="hero-meta">
              <span className={difficultyClass[currentRoom.difficulty]}>
                {currentRoom.difficulty}
              </span>
              <span>{currentDomain?.title || "Cyber Training Lab"}</span>
              <span>{currentRoom.targetIp || "local-sim"}</span>
              <span>20 min</span>
            </div>
          </div>

          <button
            type="button"
            className="button primary-button hero-action"
            onClick={() => onOpenRoom(currentRoom.order, "guided", "dashboard")}
          >
            <Play size={17} />
            Start room
          </button>
        </div>
      </section>

      <section className="program-card">
        <div className="program-header">
          <div className="program-visual">
            <img
              src={domainImages[selectedDomain.id] || genericLabImage}
              alt=""
            />
          </div>
          <div className="program-copy">
            <span className="kicker">Selected program</span>
            <h2 className="card-title">{selectedDomain.title}</h2>
            <p className="card-text">{selectedDomain.description}</p>
            <div className="chip-row">
              <TagChip>{selectedStats.rooms.length} rooms</TagChip>
              <TagChip>{selectedStats.completed} completed</TagChip>
              <TagChip>{selectedStats.percent}% progress</TagChip>
            </div>
          </div>
          <button
            type="button"
            className="button program-action"
            onClick={() => onOpenTrack(selectedDomain.id)}
          >
            Open program
          </button>
        </div>

        <div className="program-room-list">
          {visibleSelectedRooms.map((room) => {
            const status = getRoomStatus(runtime, room);
            return (
              <button
                key={room.id}
                type="button"
                className="program-room-row"
                disabled={status === "locked"}
                onClick={() => onOpenRoom(room.order, "guided", "dashboard")}
              >
                <div className="room-thumb">
                  <img
                    src={roomImages[room.id] || genericLabImage}
                    alt=""
                  />
                </div>
                <div>
                  <strong className="room-title">{room.title}</strong>
                  <span className="room-desc">{room.objective}</span>
                </div>
                <div className="room-meta">
                  <StatusBadge status={status} />
                  <span className={difficultyClass[room.difficulty]}>{room.difficulty}</span>
                </div>
              </button>
            );
          })}
          {!visibleSelectedRooms.length && (
            <div className="card-text">
              No room matches the current search.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
