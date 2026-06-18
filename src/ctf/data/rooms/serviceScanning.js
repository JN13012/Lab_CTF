export const serviceScanning = {
  id: "service-scanning",
  order: 3,
  title: "Service Scanning",
  category: "Network",
  difficulty: "Easy",
  flag: "TRY_HARD",
  unlocks: ["nmap", "nc"],
  targetIp: "10.0.2.15",
  objective:
    "Scanner la cible, identifier les services exposés et exploiter le service debug.",
  scenario:
    "Une VM d'entraînement expose plusieurs services. Un service Flask semble mal configuré.",
  hint: "Lance nmap -sV 10.0.2.15 puis connecte-toi au port Flask avec nc.",
  files: {
    "readme.txt":
      "You are acting as a penetration tester. Enumerate exposed services on the target host.",
    "network.txt":
      "Use nmap with service version detection on target IP: 10.0.2.15.",
  },
  services: [
    { port: "21", state: "open", service: "ftp", version: "vsftpd 3.0.3 (Anonymous allowed)" },
    { port: "22", state: "open", service: "ssh", version: "OpenSSH 8.2p1 Ubuntu" },
    { port: "80", state: "open", service: "http", version: "Apache 2.4.41" },
    { port: "5000", state: "open", service: "http", version: "Flask API (DEBUG MODE ENABLED -- DANGER)" },
  ],
};
