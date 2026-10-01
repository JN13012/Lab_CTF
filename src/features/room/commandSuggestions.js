const commandHintsByRoom = {
  footprinting: ["ls -la", "cat readme.txt", "cat .flag.txt"],
  "linux-commands": ["ls -la", "find backup", "grep FLAG"],
  "service-scanning": ["cat network.txt", "nmap -sV 10.0.2.15", "nc 10.0.2.15 5000"],
  "web-sqli": ["gobuster 10.0.2.15", "curl /api/login", "sqlmap http://10.0.2.15/api/login --data='username=admin&password=test'"],
  bruteforce: ["cat .hashes.txt", "john --wordlist=/usr/share/wordlists/rockyou.txt .hashes.txt", "ssh dev@10.0.2.15"],
  metasploit: ["msfconsole", "use exploit/windows/smb/ms17_010_eternalblue", "set RHOSTS 10.0.2.25"],
  siem: ["siem", "search index=ctf | stats count", "search index=ctf sourcetype=endpoint_telemetry"],
  forensic: ["strings updater.exe", "netstat -ano", "ps"],
  hardening: ["firewall status", "waf enable", "snort start"],
};

export const getSuggestedCommands = (room) =>
  commandHintsByRoom[room.id] || ["ls", "cat readme.txt", "hint"];
