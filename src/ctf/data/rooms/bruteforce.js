export const bruteforce = {
  id: "bruteforce",
  order: 5,
  title: "Brute Force",
  category: "Cracking",
  difficulty: "Medium",
  flag: "M0tivation2026!",
  unlocks: ["john", "hashcat", "ssh"],
  targetIp: "10.0.2.15",
  objective:
    "Cracker des hashes, pivoter en SSH, récupérer un secret et finaliser avec hashcat.",
  scenario:
    "Des identifiants ont été extraits d'une base compromise. Tous les mots de passe ne sont pas dans les petites wordlists.",
  hint:
    "Crack d'abord .hashes.txt avec rockyou, connecte-toi en SSH, puis lis les guides john/ssh/hashcat.",
  files: {
    "readme.txt":
      "User credentials have been extracted from database and stored in .hashes.txt as MD5 hashes.",
    ".hashes.txt":
      "admin:216b0a84582521479c73b7ba56d17f77\ndev:650a82a075701f1e40c182082cbf3e15",
    "john.txt":
      "john --wordlist=/usr/share/wordlists/rockyou.txt .hashes.txt",
    "ssh.txt": "ssh <user>@10.0.2.15. Discovered accounts: dev, admin.",
  },
};
