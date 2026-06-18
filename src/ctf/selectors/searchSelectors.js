import { getDomainChallenges, getStandaloneRoom } from "../data";
import { getDomainForRoom } from "./domainSelectors";

export const normalize = (value) => value.toLowerCase().trim();

export function roomMatchesSearch(room, query) {
  if (!query) return true;
  const domain = getDomainForRoom(room);
  const haystack = [
    room.title,
    room.category,
    room.difficulty,
    room.objective,
    room.scenario,
    domain?.title || "",
    ...(room.unlocks || []),
  ].join(" ");
  return normalize(haystack).includes(normalize(query));
}

export function domainMatchesSearch(domain, query) {
  if (!query) return true;
  const rooms = getDomainChallenges(domain);
  const haystack = [
    domain.title,
    domain.description,
    ...rooms.flatMap((room) => [room.title, room.category, room.difficulty, room.objective]),
  ].join(" ");
  return normalize(haystack).includes(normalize(query));
}

export function challengeMatchesSearch(challenge, query) {
  if (!query) return true;
  const room = getStandaloneRoom(challenge);
  const haystack = [
    challenge.title,
    challenge.category,
    challenge.difficulty,
    challenge.description,
    ...(challenge.tags || []),
    room?.title || "",
  ].join(" ");
  return normalize(haystack).includes(normalize(query));
}
