import assert from "node:assert/strict";
import test from "node:test";

import { getChallengeById } from "../src/ctf/data/index.js";
import { createInitialRuntime } from "../src/ctf/runtime/createInitialRuntime.js";
import {
  checkAnswer,
  getRoomTaskProgress,
  getRoomTasks,
  isTaskDone,
} from "../src/ctf/selectors/index.js";

test("checkAnswer ignores case and surrounding spaces", () => {
  const question = { id: "q", answer: [".flag.txt"] };
  assert.equal(checkAnswer(question, "  .FLAG.txt "), true);
  assert.equal(checkAnswer(question, "flag.txt"), false);
});

test("room progress counts answered questions and the flag", () => {
  const room = getChallengeById("footprinting");
  const runtime = createInitialRuntime();
  const total = getRoomTasks(room).flatMap((task) => task.questions).length;

  assert.deepEqual(getRoomTaskProgress(runtime, room), { answered: 0, total, percent: 0 });

  const progressed = {
    ...runtime,
    answers: { footprinting: ["ready", "ls-option", "hidden-name"] },
    completedRooms: ["footprinting"],
  };
  assert.equal(getRoomTaskProgress(progressed, room).percent, 100);
  assert.ok(getRoomTasks(room).every((task) => isTaskDone(progressed, room, task)));
});

test("rooms without authored tasks get a default briefing and flag task", () => {
  const room = getChallengeById("metasploit");
  const tasks = getRoomTasks(room);
  assert.equal(tasks.length, 3);
  assert.equal(tasks.at(-1).questions[0].kind, "flag");
});
