export const linuxCommands = {
  id: "linux-commands",
  order: 2,
  title: "Linux Investigation",
  category: "Linux",
  difficulty: "Easy",
  flag: "Grep_Is_Magic",
  unlocks: ["find", "grep"],
  objective:
    "Use ls, cat, find and grep to recover a secret from realistic maintenance artifacts.",
  scenario:
    "You land on a staging server after a migration. Logs, backups, configs and admin notes are mixed together; follow the clues instead of opening files at random.",
  hint:
    "Start with ls -la, look for backup files with find backup, then use grep FLAG to isolate the right artifact before reading it with cat.",
  files: {
    "readme.txt":
      "Mission: inspecte les artefacts du serveur de staging. Les secrets ne sont pas dans les fichiers evidents.",
    "access.log":
      "2026-04-23T09:12:10Z GET /health 200\n2026-04-23T09:14:42Z GET /login 200\n2026-04-23T09:18:05Z GET /backup/ 403",
    "auth.log":
      "Apr 23 09:21:10 staging sshd[1182]: Accepted publickey for deploy\nApr 23 09:23:44 staging sshd[1201]: Failed password for root from 10.0.2.99",
    "app.conf":
      "[app]\nenv=staging\nlogs=/var/log/cyberlab\nbackup_index=.backup_index.txt",
    ".env":
      "APP_ENV=staging\nDB_HOST=10.0.2.15\nDB_USER=training_app\nDB_PASSWORD=redacted\nSECRET_STATUS=moved_to_backup_notes",
    ".backup_index.txt":
      "backup_2026-04-22-notes.txt checksum ok\nbackup_2026-04-23-notes.txt review required",
    "backup_2026-04-22-notes.txt":
      "Rotation des logs OK. Aucun secret actif dans ce backup.",
    "backup_2026-04-23-notes.txt":
      "Migration staging terminee. TODO: retirer la ligne de validation CTF avant publication. FLAG{Grep_Is_Magic}",
    "deploy_notes.txt":
      "Le backup du 23/04 contient encore les notes de validation. Nettoyage a faire avant livraison.",
    "todo.txt":
      "Verifier .env, app.conf et les backups avant publication du lab.",
    "users.csv": "admin,disabled\ndeploy,active\nanalyst,active",
  },
};
