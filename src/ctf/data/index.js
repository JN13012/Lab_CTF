import { domainCatalog } from "./domains";
import { challenges } from "./rooms";
import { standaloneChallenges } from "./standaloneChallenges";

export { domainCatalog } from "./domains";
export { challenges } from "./rooms";
export { standaloneChallenges } from "./standaloneChallenges";

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
