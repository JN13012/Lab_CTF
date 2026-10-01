import assert from "node:assert/strict";
import test from "node:test";

import { challenges, getChallengeById } from "../src/ctf/data/index.js";
import { createInitialRuntime } from "../src/ctf/runtime/createInitialRuntime.js";
import { getRoomStatus } from "../src/ctf/selectors/roomSelectors.js";
import { parseCommand } from "../src/ctf/terminal/parser.js";
import { runCommand } from "../src/ctf/terminal/terminalEngine.js";

test("parseCommand keeps quoted option values together", () => {
  const parsed = parseCommand(
    "sqlmap http://10.0.2.15/api/login --data='username=admin&password=test'",
  );

  assert.equal(parsed.command, "sqlmap");
  assert.deepEqual(parsed.args, [
    "sqlmap",
    "http://10.0.2.15/api/login",
    "--data=username=admin&password=test",
  ]);
});

test("rooms unlock sequentially", () => {
  const runtime = createInitialRuntime();

  assert.equal(getRoomStatus(runtime, challenges[0]), "available");
  assert.equal(getRoomStatus(runtime, challenges[1]), "locked");

  const progressed = { ...runtime, completedRooms: [challenges[0].id] };
  assert.equal(getRoomStatus(progressed, challenges[1]), "available");
});

test("hint is available in the single room mode", () => {
  const result = runCommand(createInitialRuntime(), "hint");

  assert.equal(result.next.roomStats.footprinting.hints, 1);
  assert.ok(result.logs.some((log) => log.msg.startsWith("HINT:")));
});

test("submit accepts wrapped flags and completes the active room", () => {
  const runtime = createInitialRuntime();
  const result = runCommand(runtime, "submit FLAG{Welcome_User}");

  assert.ok(result.next.completedRooms.includes("footprinting"));
  assert.ok(result.logs.some((log) => log.msg.includes("ROOM COMPLETED")));
});

test("sqlmap accepts a quoted data payload", () => {
  const runtime = {
    ...createInitialRuntime(),
    activeRoomId: "web-sqli",
    completedRooms: ["footprinting", "linux-commands", "service-scanning"],
  };
  const result = runCommand(
    runtime,
    "sqlmap http://10.0.2.15/api/login --data='username=admin&password=test'",
  );

  assert.ok(result.logs.some((log) => log.msg === "FLAG{NO_PAIN_NO_GAIN}"));
});

test("hardening workflow unlocks the final flag", () => {
  let runtime = {
    ...createInitialRuntime(),
    activeRoomId: "hardening",
    completedRooms: challenges.slice(0, 8).map((room) => room.id),
  };
  const commands = [
    "firewall deny 445",
    "firewall deny 4444",
    "firewall deny 5000",
    "firewall blockip 45.83.122.91",
    "waf enable",
    "waf ratelimit set global 60",
    "waf ruleset enable sqli_basic",
    "snort start",
    "snort interface eth0",
    "snort rules enable scan.rules",
    "snort rules enable malware.rules",
    "snort threshold scan --rate 10 --window 1 --track src_ip",
  ];

  let logs = [];
  for (const command of commands) {
    const result = runCommand(runtime, command);
    runtime = result.next;
    logs = result.logs;
  }

  const room = getChallengeById("hardening");
  assert.ok(logs.some((log) => log.msg === `FLAG{${room.flag}}`));
});
