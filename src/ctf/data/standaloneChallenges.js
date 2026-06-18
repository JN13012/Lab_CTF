export const standaloneChallenges = [
  {
    id: "sqli-login-bypass",
    roomId: "web-sqli",
    title: "SQLi Login Bypass",
    category: "Web",
    difficulty: "Medium",
    points: 75,
    tags: ["SQLi", "API", "Auth"],
    description:
      "Exploit an injectable login endpoint and prove access by extracting the challenge flag.",
  },
  {
    id: "crack-the-hash",
    roomId: "bruteforce",
    title: "Crack The Hash",
    category: "Cracking",
    difficulty: "Medium",
    points: 80,
    tags: ["John", "Hashcat", "SSH"],
    description:
      "Recover credentials from leaked hashes, pivot over SSH and finish with a mask attack.",
  },
  {
    id: "find-the-c2",
    roomId: "forensic",
    title: "Find The C2",
    category: "Forensic",
    difficulty: "Medium",
    points: 70,
    tags: ["IR", "Netstat", "Malware"],
    description:
      "Investigate a suspicious binary, identify the attacker infrastructure and contain persistence.",
  },
  {
    id: "blue-team-splunk",
    roomId: "siem",
    title: "Blue Team Splunk",
    category: "SOC",
    difficulty: "Medium",
    points: 65,
    tags: ["Splunk", "Logs", "Threat Hunting"],
    description:
      "Correlate SIEM events and isolate the attacker IP from endpoint telemetry.",
  },
  {
    id: "eternalblue-privesc",
    roomId: "metasploit",
    title: "EternalBlue PrivEsc",
    category: "Exploitation",
    difficulty: "Hard",
    points: 120,
    tags: ["Metasploit", "SMB", "Windows"],
    description:
      "Exploit an exposed SMB service, open a Meterpreter session and escalate to SYSTEM.",
  },
  {
    id: "lockdown-final",
    roomId: "hardening",
    title: "Lockdown Final",
    category: "Defense",
    difficulty: "Hard",
    points: 100,
    tags: ["Firewall", "WAF", "IDS"],
    description:
      "Harden a compromised stack by reducing exposure and deploying detection controls.",
  },
];
