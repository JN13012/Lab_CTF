import { challenges } from "./rooms/index.js";

export * from "./curriculum.js";
export * from "./plannedRooms.js";
export * from "./domains.js";
export { challenges } from "./rooms/index.js";

export const getChallengeByOrder = (order) =>
  challenges.find((challenge) => challenge.order === order);

export const getChallengeById = (id) =>
  challenges.find((challenge) => challenge.id === id);
