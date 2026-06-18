import { domainCatalog, getDomainChallenges } from "../data";
import { getRoomStatus } from "./roomSelectors";

export function getDomainStats(runtime, domain) {
  const rooms = getDomainChallenges(domain);
  const completed = rooms.filter(
    (room) => getRoomStatus(runtime, room) === "completed",
  ).length;
  const available = rooms.some((room) => getRoomStatus(runtime, room) === "available");
  const percent = Math.round((completed / rooms.length) * 100);

  return { rooms, completed, available, percent };
}

export function getDomainForRoom(room) {
  return domainCatalog.find((domain) => domain.challengeIds.includes(room.id));
}
