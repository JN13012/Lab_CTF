export const hardening = {
  id: "hardening",
  order: 9,
  title: "Final Hardening",
  category: "Defense",
  difficulty: "Hard",
  flag: "LockBit",
  unlocks: ["firewall", "waf", "snort"],
  objective:
    "Durcir l'infrastructure avec firewall, WAF et IDS jusqu'à débloquer le flag final.",
  scenario:
    "Après compromission, tu reprends le contrôle défensif: réduire l'exposition, filtrer l'attaquant et activer la détection.",
  hint:
    "Bloque 445/4444/5000 et 45.83.122.91, configure waf 60 req/min + sqli_basic, puis Snort eth0 + scan/malware rules.",
  files: {
    "readme.txt":
      "Configure firewall, WAF and IDS to complete the CTF.",
    "firewall.txt":
      "firewall deny 445\nfirewall deny 4444\nfirewall deny 5000\nfirewall blockip 45.83.122.91",
    "waf.txt":
      "waf ratelimit set global 60\nwaf ruleset enable sqli_basic",
    "snort.txt":
      "snort start\nsnort interface eth0\nsnort rules enable scan.rules\nsnort rules enable malware.rules\nsnort threshold scan --rate 10 --window 1 --track src_ip",
  },
};
