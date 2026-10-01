import { challenges } from "../data/index.js";
import { difficultyPoints, ranks } from "../data/curriculum.js";

export function getCurrentRoomStats(runtime, roomId) {
  return {
    commands: 0,
    hints: 0,
    flagAttempts: 0,
    ...(runtime.roomStats?.[roomId] || {}),
  };
}

export function getRoomPoints(room) {
  return difficultyPoints[room.difficulty] || 0;
}

export function getTotalPoints(runtime) {
  return challenges
    .filter((room) => runtime.completedRooms?.includes(room.id))
    .reduce((total, room) => total + getRoomPoints(room), 0);
}

export function getMaxPoints() {
  return challenges.reduce((total, room) => total + getRoomPoints(room), 0);
}

export function getRank(points) {
  const index = ranks.findLastIndex((rank) => points >= rank.minPoints);
  return { current: ranks.at(index), next: ranks.at(index + 1) || null };
}
