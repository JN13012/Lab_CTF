import assert from "node:assert/strict";
import test from "node:test";

import { challenges, getModuleById, levels, modules, plannedRooms } from "../src/ctf/data/index.js";
import { getDomainRooms, getModuleStatus } from "../src/ctf/selectors/index.js";

const allRooms = [...challenges, ...plannedRooms];

test("every room belongs to exactly one module", () => {
  for (const room of allRooms) {
    const owners = modules.filter((module) => module.roomIds.includes(room.id));
    assert.equal(owners.length, 1, `${room.id} is in ${owners.length} modules`);
  }
});

test("planned room ids never collide with playable rooms", () => {
  const playable = new Set(challenges.map((room) => room.id));
  for (const room of plannedRooms) assert.ok(!playable.has(room.id), `${room.id} is both planned and playable`);
});

test("modules reference existing rooms, levels and prerequisites", () => {
  const roomIds = new Set(allRooms.map((room) => room.id));
  const levelIds = new Set(levels.map((level) => level.id));
  for (const module of modules) {
    assert.ok(levelIds.has(module.levelId), `${module.id} has an unknown level`);
    for (const roomId of module.roomIds) assert.ok(roomIds.has(roomId), `${module.id} lists unknown room ${roomId}`);
    for (const prerequisite of module.prerequisites) {
      assert.ok(getModuleById(prerequisite), `${module.id} requires unknown module ${prerequisite}`);
    }
  }
});

test("module room order follows the room unlock order", () => {
  const orderOf = (id) => challenges.find((room) => room.id === id)?.order;
  const sequence = modules.flatMap((module) => module.roomIds.map(orderOf)).filter((order) => order !== undefined);
  assert.deepEqual(sequence, [...sequence].sort((a, b) => a - b));
});

test("areas only count their own rooms, and planned modules are coming soon", () => {
  const runtime = { activeDomainId: "ai", completedRooms: [] };
  const aiRooms = getDomainRooms(runtime);
  assert.ok(aiRooms.length > 0);
  assert.ok(aiRooms.every((room) => room.planned));
  for (const module of modules.filter((item) => item.levelId === "ai1")) {
    assert.equal(getModuleStatus(runtime, module), "soon");
  }
  assert.equal(getDomainRooms({ activeDomainId: "cyber" }).length, challenges.length);
});
