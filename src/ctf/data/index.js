import { domainCatalog } from "./domains.js";
import { challenges } from "./rooms/index.js";
import { standaloneChallenges } from "./standaloneChallenges.js";

export { domainCatalog } from "./domains.js";
export { challenges } from "./rooms/index.js";
export { standaloneChallenges } from "./standaloneChallenges.js";

export const getChallengeByOrder = (order) =>
  challenges.find((challenge) => challenge.order === order);

export const getChallengeById = (id) =>
  challenges.find((challenge) => challenge.id === id);

export const getDomainChallenges = (domain) =>
  domain.challengeIds
    .map((id) => challenges.find((challenge) => challenge.id === id))
    .filter(Boolean);

export const getStandaloneRoom = (challenge) =>
  challenges.find((room) => room.id === challenge.roomId);
