export const siem = {
  id: "siem",
  order: 7,
  title: "SIEM Log Analysis",
  category: "SOC",
  difficulty: "Medium",
  flag: "WORM_ILOVEYOU",
  unlocks: ["siem"],
  objective:
    "Analyser les logs Splunk simulés et identifier l'IP attaquante.",
  scenario:
    "Une alerte critique a été déclenchée. Il faut corréler les logs pour retrouver la trace de l'attaque.",
  hint:
    "Entre dans siem, lance search index=ctf | stats count puis cherche sourcetype=endpoint_telemetry.",
  files: {
    "readme.txt":
      "You are now a SOC analyst. Analyze logs and identify the attacker IP address.",
    "siem.txt":
      "search index=ctf | stats count\nsearch index=ctf sourcetype=endpoint_telemetry",
  },
};
