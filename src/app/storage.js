export const STORAGE_KEY = "nctf-cyber-lab-state";
export const STORAGE_SCHEMA_VERSION = 2;
export const MAX_SAVED_LOGS = 300;

export function capLogs(logs = []) {
  return logs.slice(-MAX_SAVED_LOGS);
}

function migrateSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return null;

  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    runtime: snapshot.runtime,
    logs: capLogs(snapshot.logs || []),
  };
}

function getStorage() {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

export function loadSavedState() {
  const storage = getStorage();
  if (!storage) return null;

  try {
    return migrateSnapshot(JSON.parse(storage.getItem(STORAGE_KEY)));
  } catch {
    return null;
  }
}

export function saveState(snapshot) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: STORAGE_SCHEMA_VERSION,
        runtime: snapshot.runtime,
        logs: capLogs(snapshot.logs),
      }),
    );
  } catch {
    // Ignore quota/private-mode failures: the lab remains usable in-memory.
  }
}

export function clearSavedState() {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to recover here.
  }
}
