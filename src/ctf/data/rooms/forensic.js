export const forensic = {
  id: "forensic",
  order: 8,
  title: "Forensic",
  category: "Incident Response",
  difficulty: "Medium",
  flag: "NotPetya",
  unlocks: ["strings", "netstat", "ps", "kill"],
  objective:
    "Analyser un binaire suspect, relier une connexion réseau à un PID et contenir la menace.",
  scenario:
    "Le SOC confirme une compromission. Tu dois isoler le processus de persistance.",
  hint:
    "strings updater.exe, netstat -ano, ps, puis kill le PID lié à 45.83.122.91:4444.",
  files: {
    "readme.txt":
      "SOC analysis confirms compromise. ATTACKER_IP = 45.83.122.91.",
    "forensic.txt":
      "Updater.exe was recovered from the compromised machine. Begin forensic workflow using strings updater.exe.",
    "updater.exe": "Binary flagged as suspicious (PE32 executable, packed).",
    "netstat.txt": "Use netstat -ano to show numerical addresses and owning PID.",
  },
};
