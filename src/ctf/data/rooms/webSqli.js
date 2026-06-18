export const webSqli = {
  id: "web-sqli",
  order: 4,
  title: "Web Exploitation",
  category: "Web",
  difficulty: "Medium",
  flag: "NO_PAIN_NO_GAIN",
  unlocks: ["gobuster", "curl", "sqlmap"],
  targetIp: "10.0.2.15",
  objective:
    "Enumérer l'API, identifier un paramètre vulnérable et confirmer une SQL injection.",
  scenario:
    "Le service Flask trouvé précédemment expose une API interne. Les endpoints ne sont pas tous documentés.",
  hint:
    "Utilise gobuster 10.0.2.15, inspecte /api/login avec curl, puis sqlmap avec le bon POST data.",
  directories: ["/backup", "/dev_admin_portal", "/api/login", "/api/users"],
  files: {
    "readme.txt":
      "Continue the security audit. A Flask API is exposed on 10.0.2.15 with debug mode enabled.",
    ".web_config.txt": "DEBUG=True\nDB_ENGINE=SQLite\nDB_PATH=/var/www/app.db\nADMIN_PANEL=/dev_admin_portal",
  },
};
