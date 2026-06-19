export const domainCatalog = [
  {
    id: "recon",
    title: "Fondations CTF",
    description:
      "Observer l'environnement, fouiller les fichiers et scanner les premiers services exposes.",
    challengeIds: ["footprinting", "linux-commands", "service-scanning"],
  },
  {
    id: "web",
    title: "Web Application Security",
    description:
      "Map hidden endpoints, inspect API behavior and exploit web application weaknesses.",
    challengeIds: ["web-sqli"],
  },
  {
    id: "cracking",
    title: "Password Attacks",
    description:
      "Recover credentials through wordlists, SSH pivoting and GPU-style mask attacks.",
    challengeIds: ["bruteforce"],
  },
  {
    id: "exploitation",
    title: "System Exploitation",
    description:
      "Use exploitation frameworks, open sessions and escalate privileges on target systems.",
    challengeIds: ["metasploit"],
  },
  {
    id: "soc",
    title: "SOC & SIEM Analysis",
    description:
      "Correlate logs, identify attacker infrastructure and reconstruct attack chains.",
    challengeIds: ["siem"],
  },
  {
    id: "forensic",
    title: "Forensic Response",
    description:
      "Analyze suspicious artifacts, map network connections and contain persistence.",
    challengeIds: ["forensic"],
  },
  {
    id: "hardening",
    title: "Infrastructure Hardening",
    description:
      "Reduce exposed services, configure WAF controls and deploy IDS detection policy.",
    challengeIds: ["hardening"],
  },
];
