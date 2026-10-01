import { getChallengeById, getPlannedRoomById } from "../data/index.js";
import { getModuleById, levels, modules } from "../data/curriculum.js";
import { getRoomPoints } from "./progressSelectors.js";
import { getRoomStatus } from "./roomSelectors.js";

export function getModuleRooms(module) {
  return module.roomIds.map((id) => getChallengeById(id) || getPlannedRoomById(id)).filter(Boolean);
}

export function getModuleStatus(runtime, module) {
  const statuses = getModuleRooms(module).map((room) => getRoomStatus(runtime, room));
  if (statuses.length && statuses.every((status) => status === "soon")) return "soon";
  if (statuses.length && statuses.every((status) => status === "completed")) return "completed";
  if (statuses.some((status) => status === "available" || status === "completed")) return "available";
  return "locked";
}

export function getModuleProgress(runtime, module) {
  const rooms = getModuleRooms(module);
  const completed = rooms.filter((room) => getRoomStatus(runtime, room) === "completed").length;
  return { completed, total: rooms.length };
}

const difficultyOrder = ["Intro", "Easy", "Medium", "Hard"];

export function getModuleDifficulty(module) {
  const ranksFound = getModuleRooms(module).map((room) => difficultyOrder.indexOf(room.difficulty));
  return difficultyOrder.at(Math.max(0, ...ranksFound));
}

export function getModulePoints(module) {
  return getModuleRooms(module).reduce((total, room) => total + getRoomPoints(room), 0);
}

export function getMissingPrerequisites(runtime, module) {
  return module.prerequisites
    .map(getModuleById)
    .filter((prerequisite) => prerequisite && getModuleStatus(runtime, prerequisite) !== "completed");
}

export function getLevelStats(runtime, level) {
  const levelModules = modules.filter((module) => module.levelId === level.id);
  const completed = levelModules.filter(
    (module) => getModuleStatus(runtime, module) === "completed",
  ).length;
  return { modules: levelModules, completed, total: levelModules.length };
}

export function getDomainLevels(runtime) {
  return levels.filter((level) => level.domainId === (runtime.activeDomainId || "cyber"));
}

export function getDomainModules(runtime) {
  const levelIds = getDomainLevels(runtime).map((level) => level.id);
  return modules.filter((module) => levelIds.includes(module.levelId));
}

export function getDomainRooms(runtime) {
  return getDomainModules(runtime).flatMap(getModuleRooms);
}

export function getCurrentLevel(runtime) {
  const domainLevels = getDomainLevels(runtime);
  return (
    domainLevels.find((level) => {
      const stats = getLevelStats(runtime, level);
      return stats.completed < stats.total;
    }) || domainLevels.at(-1)
  );
}

export function getCurrentModule(runtime) {
  const domainModules = getDomainModules(runtime);
  return (
    domainModules.find((module) => getModuleStatus(runtime, module) === "available") ||
    domainModules.find((module) => getModuleStatus(runtime, module) === "soon") ||
    domainModules.at(-1)
  );
}
