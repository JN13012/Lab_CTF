export const baseHardening = {
  firewall: { rules: [], blockedIps: [] },
  waf: { enabled: false, rateLimitValue: null, rulesets: {} },
  snort: {
    enabled: false,
    interface: null,
    rules: { "local.rules": false, "scan.rules": false, "malware.rules": false },
    scanPolicy: null,
  },
};

export const createInitialRuntime = () => ({
  level: 1,
  activeRoomId: "footprinting",
  solved: false,
  completedRooms: [],
  roomStats: {},
  notes: {},
  trainingMode: "guided",
  remoteSession: null,
  crackedPasswords: {},
  sshLoginPending: null,
  leakedHashes: [],
  msf: { module: null, options: {} },
  meterpreter: { user: "GUEST USER", integrity: "Low", migratedPid: null },
  hardening: structuredClone(baseHardening),
});
