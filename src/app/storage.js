export const STORAGE_KEY = "nctf-cyber-lab-state";

export function loadSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function saveState(snapshot) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function clearSavedState() {
  localStorage.removeItem(STORAGE_KEY);
}
