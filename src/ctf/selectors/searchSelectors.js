import { getModuleForRoom } from "../data/index.js";

export const normalize = (value) => value.toLowerCase().trim();

export function roomMatchesSearch(room, query) {
  if (!query) return true;
  const haystack = [
    room.title,
    room.difficulty,
    room.objective,
    room.scenario,
    getModuleForRoom(room.id)?.title || "",
    ...(room.unlocks || []),
  ].join(" ");
  return normalize(haystack).includes(normalize(query));
}
