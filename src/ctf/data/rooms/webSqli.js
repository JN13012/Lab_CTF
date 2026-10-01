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
    "Enumerate the API, identify a vulnerable parameter and confirm a SQL injection.",
  scenario:
    "The Flask service found earlier exposes an internal API. Not every endpoint is documented.",
  hint:
    "Run gobuster 10.0.2.15, inspect /api/login with curl, then sqlmap with the right POST data.",
  directories: ["/backup", "/dev_admin_portal", "/api/login", "/api/users"],
  files: {
    "readme.txt":
      "Continue the security audit. A Flask API is exposed on 10.0.2.15 with debug mode enabled.",
    ".web_config.txt": "DEBUG=True\nDB_ENGINE=SQLite\nDB_PATH=/var/www/app.db\nADMIN_PANEL=/dev_admin_portal",
  },
};
