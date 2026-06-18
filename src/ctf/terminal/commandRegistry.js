const commandRegistry = {
  basic: ["help", "clear", "hint", "ls", "cat", "find", "grep", "submit"],
  recon: ["nmap", "nc", "gobuster", "curl"],
  web: ["sqlmap"],
  cracking: ["john", "hashcat", "ssh"],
  exploitation: ["msfconsole", "meterpreter"],
  soc: ["siem"],
  forensic: ["strings", "netstat", "ps", "kill"],
  hardening: ["firewall", "waf", "snort"],
};

export const toolCommands = new Set(
  Object.values(commandRegistry)
    .flat()
    .filter((command) => !["help", "clear", "hint", "ls", "cat", "submit"].includes(command)),
);
