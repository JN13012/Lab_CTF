import { challenges, getChallengeById } from "../data";
export { bootLogs, createInitialRuntime } from "../runtime";
import { toolCommands } from "./commandRegistry";
import { parseCommand } from "./parser";

const out = (msg, type = "out") => ({ msg, type });
const sys = (msg) => out(msg, "sys");
const err = (msg) => out(msg, "err");
const input = (msg) => out(msg, "in");
const normalizeFlag = (candidate) => candidate?.replace(/^FLAG\{(.+)\}$/, "$1");

const clone = (runtime) => ({
  ...runtime,
  activeRoomId: runtime.activeRoomId || "footprinting",
  completedRooms: [...(runtime.completedRooms || [])],
  roomStats: Object.fromEntries(
    Object.entries(runtime.roomStats || {}).map(([roomId, stats]) => [
      roomId,
      { ...stats },
    ]),
  ),
  notes: { ...(runtime.notes || {}) },
  trainingMode: ["guided", "challenge"].includes(runtime.trainingMode)
    ? runtime.trainingMode
    : "guided",
  crackedPasswords: { ...runtime.crackedPasswords },
  msf: { module: runtime.msf.module, options: { ...runtime.msf.options } },
  meterpreter: { ...runtime.meterpreter },
  hardening: structuredClone(runtime.hardening),
});

const listFiles = (files, showAll = false) =>
  Object.keys(files)
    .filter((name) => showAll || !name.startsWith("."))
    .sort()
    .join("    ");

const updateRoomStats = (runtime, roomId, patch) => {
  const current = runtime.roomStats?.[roomId] || {};
  runtime.roomStats = {
    ...(runtime.roomStats || {}),
    [roomId]: {
      commands: 0,
      hints: 0,
      flagAttempts: 0,
      ...current,
      ...patch(current),
    },
  };
};

const hasTool = (challenge, command) =>
  !toolCommands.has(command) || challenge.unlocks.includes(command);

const evaluateHardening = (state) => {
  const requiredPorts = { 22: "ALLOW", 80: "ALLOW", 443: "ALLOW", 445: "DENY", 4444: "DENY", 5000: "DENY" };
  const firewallPortsOk = Object.entries(requiredPorts).every(([port, expected]) => {
    const lastRule = state.firewall.rules.filter((rule) => rule.port === Number(port)).slice(-1)[0];
    const current = lastRule?.action || "ALLOW";
    return current === expected;
  });
  const firewallOk = firewallPortsOk && state.firewall.blockedIps.includes("45.83.122.91");
  const wafOk = state.waf.rateLimitValue === 60 && state.waf.rulesets.sqli_basic === true;
  const snortOk =
    state.snort.enabled &&
    state.snort.interface === "eth0" &&
    state.snort.scanPolicy?.count === 10 &&
    state.snort.scanPolicy?.interval === 1 &&
    state.snort.scanPolicy?.track === "src_ip" &&
    state.snort.rules["scan.rules"] &&
    state.snort.rules["malware.rules"] &&
    !state.snort.rules["local.rules"];

  return { firewallOk, wafOk, snortOk, allOk: firewallOk && wafOk && snortOk };
};

const unlockNext = (next, logs, challenge) => {
  const completedRooms = new Set(next.completedRooms || []);
  const alreadyCompleted = completedRooms.has(challenge.id);

  completedRooms.add(challenge.id);
  next.completedRooms = [...completedRooms];
  next.solved = next.completedRooms.length >= challenges.length;
  updateRoomStats(next, challenge.id, (current) => ({
    completedAt: current.completedAt || new Date().toISOString(),
  }));

  if (alreadyCompleted) {
    logs.push(sys("[+] FLAG VALID. ROOM ALREADY COMPLETED."));
  } else {
    logs.push(sys("[+] FLAG VALID. ROOM COMPLETED."));
    logs.push(sys("SELECT ANY ROOM TO CONTINUE TRAINING."));
  }

  if (next.solved) {
    next.solved = true;
    logs.push(sys("[!] CONGRATULATIONS!"));
    logs.push(out("CYBERSECURITY CERTIFICATE GRANTED", "sys"));
  }

  next.remoteSession = null;
  next.sshLoginPending = null;
  return { next, logs };
};

const submitFlag = (next, logs, challenge, candidate) => {
  updateRoomStats(next, challenge.id, (current) => ({
    flagAttempts: (current.flagAttempts || 0) + 1,
  }));
  const normalized = normalizeFlag(candidate);
  if (normalized === challenge.flag) {
    return unlockNext(next, logs, challenge);
  }
  logs.push(err("[-] FLAG INCORRECT."));
  return { next, logs };
};

const handleRemote = (next, logs, challenge, command, args, raw) => {
  const session = next.remoteSession;

  if (session?.type === "nc") {
    if (command === "ls") logs.push(out("flask-debug@10.0.2.15 : flag.txt"));
    else if (command === "cat" && args[1] === "flag.txt") logs.push(out(`flask-debug@10.0.2.15 : FLAG{${challenge.flag}}`));
    else if (command === "exit") {
      next.remoteSession = null;
      logs.push(sys("Closing connection to 10.0.2.15..."));
    } else logs.push(err(`flask-debug@10.0.2.15 : sh: ${command}: command not found`));
    return true;
  }

  if (session?.type === "ssh") {
    const prefix = `${session.user}@${session.host}`;
    if (command === "exit") {
      next.remoteSession = null;
      logs.push(sys("Closing SSH session..."));
      return true;
    }
    if (command === "help") {
      logs.push(sys("Available commands: ls, cat [file], exit"));
      return true;
    }
    if (session.user === "dev") {
      if (command === "ls") logs.push(out(`${prefix} : secret.txt flag.txt`));
      else if (command === "cat" && args[1] === "secret.txt") logs.push(out(`${prefix} : Verify ssh admin@10.0.2.15`));
      else if (command === "cat" && args[1] === "flag.txt") logs.push(sys(`${prefix} : [!] Honeypot. Flag is not here.`));
      else logs.push(err(`${prefix} : command not found`));
      return true;
    }
    if (session.user === "admin") {
      if (command === "ls") logs.push(out(`${prefix} : .secrets.txt .hashcat.txt`));
      else if (command === "cat" && args[1] === ".secrets.txt") {
        next.leakedHashes = [{ user: "FLAG", hash: "d4f3c1a5f1c6b6f5b1a6c8a0d8e5f2a1" }];
        logs.push(out(`${prefix} : FLAG : d4f3c1a5f1c6b6f5b1a6c8a0d8e5f2a1`));
        logs.push(sys(`${prefix} : [!] hashes use advanced format`));
        logs.push(sys(`${prefix} : [!] recommended tool: hashcat`));
      } else if (command === "cat" && args[1] === ".hashcat.txt") {
        logs.push(out("Hashcat reference guide"));
        logs.push(out("hashcat -m 1000 -a 3 .secrets.txt ?u?l?l?l?l?l?l?l?l?d?d?d?d?s -O -w 4"));
      } else logs.push(err(`${prefix} : command not found`));
      return command !== "hashcat";
    }
  }

  if (session?.type === "msfconsole") {
    if (command === "exit") {
      next.remoteSession = null;
      next.msf = { module: null, options: {} };
      logs.push(sys("[*] Leaving Metasploit Framework..."));
    } else if (command === "use") {
      const module = args.slice(1).join(" ");
      const valid = ["exploit/windows/smb/psexec", "exploit/windows/smb/ms17_010_eternalblue", "exploit/windows/smb/ms08_067_netapi"];
      if (!valid.includes(module)) logs.push(err("[!] unknown exploit module"));
      else {
        next.msf.module = module;
        next.msf.options = {};
        logs.push(sys(`[*] module loaded: ${module}`));
      }
    } else if (command === "set") {
      const key = args[1]?.toUpperCase();
      const value = args.slice(2).join(" ");
      if (!["RHOSTS", "LHOST", "LPORT"].includes(key)) logs.push(err("[!] unknown option"));
      else if (key === "RHOSTS" && value !== "10.0.2.25") logs.push(err("[!] target unreachable"));
      else {
        next.msf.options[key] = value;
        logs.push(sys(`[*] ${key} => ${value}`));
      }
    } else if (command === "run") {
      if (!next.msf.module) logs.push(err("[!] no exploit module selected"));
      else if (!next.msf.options.RHOSTS) logs.push(err("[!] RHOSTS not configured"));
      else if (next.msf.module === "exploit/windows/smb/ms17_010_eternalblue") {
        logs.push(out("[+] SMBv1 vulnerability detected"));
        logs.push(out("[+] Meterpreter session 1 opened"));
        next.remoteSession = { type: "meterpreter", host: next.msf.options.RHOSTS };
        logs.push(sys("meterpreter > Session established. Type help."));
      } else {
        logs.push(err("[!] exploit failed"));
        logs.push(out("[!] target does not appear exploitable with this module"));
      }
    } else logs.push(err("[!] unknown msfconsole command"));
    return true;
  }

  if (session?.type === "meterpreter") {
    if (command === "help") logs.push(sys("Session Commands: ls, cat, getuid, sysinfo, ps, migrate [PID], exit"));
    else if (command === "ls") logs.push(out("meterpreter > readme.txt    flag.txt"));
    else if (command === "getuid") {
      logs.push(out(`meterpreter > Server username: ${next.meterpreter.user}`));
      logs.push(out(`meterpreter > Integrity level: ${next.meterpreter.integrity}`));
    } else if (command === "sysinfo") {
      logs.push(out("meterpreter > OS: Windows 7 (Build 7601)"));
      logs.push(sys("meterpreter > Hint: LSASS service running"));
    } else if (command === "ps") {
      logs.push(out("PID    Name                 User"));
      logs.push(out("396    lsass.exe            SYSTEM"));
      logs.push(out("1276   cmd.exe              ADMIN"));
      logs.push(sys("meterpreter > migrate to the right process to escalate privilege"));
    } else if (command === "migrate") {
      if (args[1] === "396") {
        next.meterpreter = { user: "NT AUTHORITY\\SYSTEM", integrity: "System", migratedPid: "396" };
        logs.push(out("[+] Migration completed successfully"));
        logs.push(sys("meterpreter > Privilege escalation successful"));
      } else logs.push(err("[!] migration failed"));
    } else if (command === "cat" && args[1] === "flag.txt") {
      if (next.meterpreter.integrity !== "System") logs.push(err("meterpreter > Access denied: System privileges required"));
      else logs.push(out(`meterpreter > FLAG{${challenge.flag}}`));
    } else if (command === "exit") {
      next.remoteSession = null;
      logs.push(sys("Closing Meterpreter session..."));
    } else logs.push(err(`meterpreter > command not found: ${command}`));
    return true;
  }

  if (session?.type === "siem") {
    if (command === "exit") {
      next.remoteSession = null;
      logs.push(sys("splunk@siem closing SIEM session..."));
    } else if (raw === "search index=ctf | stats count") {
      logs.push(out("auth -> 120 events"));
      logs.push(out("web -> 340 events"));
      logs.push(out("scan_nmap -> 15 events"));
      logs.push(out("gobuster -> 220 events"));
      logs.push(out("endpoint_telemetry -> 3 events"));
    } else if (raw === "search index=ctf sourcetype=endpoint_telemetry") {
      logs.push(out('timestamp=02:14:33 alert="Meterpreter Activity Detected" severity=critical'));
      logs.push(out("src_ip=45.83.122.91 dst_host=WIN-SRV01 user=guest"));
      logs.push(out("payload=windows/x64/meterpreter/reverse_tcp"));
      logs.push(out("event_type=privilege_escalation status=confirmed"));
      logs.push(sys(`FLAG{${challenge.flag}}`));
    } else if (command === "help") logs.push(sys("Available commands: search [query], cat siem.txt, exit"));
    else logs.push(err("splunk@siem ERROR: invalid or unsupported SPL syntax"));
    return true;
  }

  return false;
};

export const runCommand = (runtime, rawCommand) => {
  const { raw, args, command } = parseCommand(rawCommand);
  const next = clone(runtime);
  const logs = [];
  const challenge = getChallengeById(next.activeRoomId) || challenges[0];

  if (!raw) return { next, logs };
  logs.push(input(raw));
  updateRoomStats(next, challenge.id, (current) => ({
    commands: (current.commands || 0) + 1,
    lastCommandAt: new Date().toISOString(),
  }));

  if (next.sshLoginPending && next.remoteSession?.type !== "ssh") {
    const { user, host } = next.sshLoginPending;
    if (raw !== next.crackedPasswords[user]) {
      next.sshLoginPending = null;
      logs.push(err("Permission denied, try again."));
      return { next, logs };
    }
    next.remoteSession = { type: "ssh", user, host };
    next.sshLoginPending = null;
    logs.push(out("SSH session established"));
    logs.push(sys(`Logged in as ${user}@${host}`));
    logs.push(sys("Available commands: ls, cat [file], exit, help"));
    return { next, logs };
  }

  if (handleRemote(next, logs, challenge, command, args, raw)) return { next, logs };

  if (!hasTool(challenge, command)) {
    logs.push(err(`${command}: tool not available in this room`));
    return { next, logs };
  }

  if (command === "help") {
    const baseCommands =
      next.trainingMode === "challenge"
        ? ["ls", "ls -la", "cat [file]", "submit [flag]", "clear"]
        : ["ls", "ls -la", "cat [file]", "hint", "submit [flag]", "clear"];
    const unlocked = [...baseCommands, ...challenge.unlocks];
    logs.push(sys(`AVAILABLE COMMANDS: ${unlocked.join(", ")}`));
  } else if (command === "clear") {
    logs.push({ msg: "__CLEAR__", type: "control" });
  } else if (command === "hint") {
    if (next.trainingMode === "challenge") {
      logs.push(err("hint: disabled in challenge mode"));
      return { next, logs };
    }
    updateRoomStats(next, challenge.id, (current) => ({
      hints: (current.hints || 0) + 1,
    }));
    logs.push(sys(`HINT: ${challenge.hint}`));
  } else if (command === "ls") {
    logs.push(out(listFiles(challenge.files, args.includes("-la") || args.includes("-a"))));
  } else if (command === "cat") {
    const file = args[1];
    if (!file) logs.push(err("usage: cat [file]"));
    else logs.push(challenge.files[file] ? out(challenge.files[file]) : err(`cat: ${file}: No such file or directory`));
  } else if (command === "find") {
    const query = args[1]?.toLowerCase();
    const matches = Object.keys(challenge.files).filter((file) => file.toLowerCase().includes(query || ""));
    logs.push(...(matches.length ? matches.map((file) => out(file)) : [sys(`find: '${args[1]}': No such file`)]));
  } else if (command === "grep") {
    const pattern = args[1]?.toLowerCase();
    const matches = Object.entries(challenge.files).filter(([, content]) => content.toLowerCase().includes(pattern || ""));
    logs.push(...(matches.length ? matches.map(([file]) => out(`Match found in: ${file}`)) : [sys("No match found.")]));
  } else if (command === "nmap") {
    const target = args.find((arg) => !arg.startsWith("-") && arg !== "nmap");
    if (target !== challenge.targetIp) logs.push(err(`nmap: ${target || "host"}: Host seems down`));
    else {
      logs.push(sys(`Starting Nmap scan on ${target}...`));
      logs.push(out("PORT      STATE    SERVICE     VERSION"));
      challenge.services.forEach((service) => logs.push(out(`${service.port}/tcp   ${service.state.padEnd(8)} ${service.service.padEnd(11)} ${service.version}`)));
      logs.push(err("[!] CRITICAL VULNERABILITY DETECTED ON PORT 5000"));
    }
  } else if (command === "nc") {
    if (args[1] === challenge.targetIp && args[2] === "5000") {
      next.remoteSession = { type: "nc", host: args[1], port: args[2] };
      logs.push(sys(`Established connection to ${args[1]}:${args[2]}`));
      logs.push(sys("Remote Commands: ls, cat [file], exit"));
    } else logs.push(err("nc: connection refused"));
  } else if (command === "gobuster") {
    if (args[1] !== "10.0.2.15") logs.push(err("Usage: gobuster [IP]"));
    else {
      logs.push(sys("Enumerating web directories on 10.0.2.15..."));
      logs.push(out("Found: /api/login (Status: 200)"));
      logs.push(out("Found: /admin (Status: 403)"));
      logs.push(sys("Scan complete. Verify possible SQL injection behavior."));
    }
  } else if (command === "curl") {
    if (args[1] === "/api/login") {
      logs.push(out("POST /api/login"));
      logs.push(out("username=admin&password=test"));
      logs.push(sys("[!] Vulnerable parameter detected: username"));
    } else logs.push(err("HTTP/1.1 404 Not Found"));
  } else if (command === "sqlmap") {
    if (raw === "sqlmap http://10.0.2.15/api/login --data='username=admin&password=test'") {
      logs.push(sys("[*] Starting sqlmap engine..."));
      logs.push(out("[+] Confirmed: Boolean-based SQL injection"));
      logs.push(out("[+] Dump successful"));
      logs.push(out(`FLAG{${challenge.flag}}`));
    } else logs.push(err("Usage: sqlmap http://10.0.2.15/api/login --data='username=admin&password=test'"));
  } else if (command === "john") {
    if (!raw.includes(".hashes.txt")) logs.push(err("Usage: john --wordlist=/usr/share/wordlists/rockyou.txt .hashes.txt"));
    else if (raw.includes("rockyou")) {
      next.crackedPasswords = { admin: "JTR13012!!", dev: "jtr13" };
      logs.push(out("[+] admin:JTR13012!! FOUND"));
      logs.push(out("[+] dev:jtr13 FOUND"));
      logs.push(sys("[*] Cracking complete"));
    } else {
      next.crackedPasswords = { dev: "jtr13" };
      logs.push(out("[+] dev:jtr13 FOUND"));
      logs.push(err("[!] admin: password not found in wordlist"));
    }
  } else if (command === "ssh") {
    const [user, host] = (args[1] || "").split("@");
    if (!user || !host) logs.push(err("Usage: ssh user@host"));
    else if (!next.crackedPasswords[user]) logs.push(err("[!] Access denied: credentials required"));
    else {
      next.sshLoginPending = { user, host };
      logs.push(sys(`[+] connecting to ${host}...`));
      logs.push(sys("Password:"));
    }
  } else if (command === "hashcat") {
    const expectedMask = "?u?l?l?l?l?l?l?l?l?d?d?d?d?s";
    if (!next.leakedHashes.length) logs.push(err("[!] no hashes loaded (read .secrets.txt first)"));
    else if (raw.includes("-m 1000") && raw.includes("-a 3") && raw.includes(expectedMask) && raw.includes("-O") && raw.includes("-w 4")) {
      logs.push(sys("[*] starting brute-force mask attack..."));
      logs.push(out("[+] hash successfully cracked"));
      logs.push(out(`FLAG{${challenge.flag}}`));
    } else logs.push(err("[!] invalid hashcat options or mask"));
  } else if (command === "msfconsole") {
    next.remoteSession = { type: "msfconsole", prompt: "msf6 >" };
    next.msf = { module: null, options: {} };
    logs.push(sys("[*] Starting Metasploit Framework..."));
    logs.push(out("Metasploit Framework 6.4.0"));
  } else if (command === "siem") {
    next.remoteSession = { type: "siem", host: "splunk-sim" };
    logs.push(sys("[+] Splunk SIEM initialized"));
  } else if (command === "strings") {
    if (args[1] === "updater.exe") {
      logs.push(sys("[*] strings analysis: updater.exe"));
      logs.push(out("C:\\Users\\Public\\updater.exe"));
      logs.push(out("[IOC] C2: http://45.83.122.91/payload.bin"));
      logs.push(out("[IOC] meterpreter_reverse_tcp"));
    } else logs.push(err(`strings: ${args[1]}: No such file`));
  } else if (command === "netstat") {
    logs.push(out("Proto  Local Address          Foreign Address        State           PID"));
    logs.push(out("TCP    10.0.2.25:49822        45.83.122.91:4444      ESTABLISHED     1337"));
  } else if (command === "ps") {
    logs.push(out("PID     PROCESS               USER"));
    logs.push(out("1337    svchost.exe           SYSTEM"));
    logs.push(sys("[*] Terminate malicious persistence process using kill <PID>"));
  } else if (command === "kill") {
    if (args[1] === "1337") {
      logs.push(out("[+] updater.exe successfully terminated"));
      logs.push(out("[+] outbound C2 communication stopped"));
      logs.push(sys(`FLAG{${challenge.flag}}`));
    } else logs.push(err(`[!] process ${args[1]} is not the malicious persistence process`));
  } else if (command === "firewall") {
    const action = args[1];
    if (action === "deny" || action === "allow") {
      const port = Number(args[2]);
      next.hardening.firewall.rules.push({ action: action === "deny" ? "DENY" : "ALLOW", port });
      logs.push(out(`[+] Rule added: ${action.toUpperCase()} tcp/${port}`));
    } else if (action === "blockip" && args[2] === "45.83.122.91") {
      next.hardening.firewall.blockedIps.push(args[2]);
      logs.push(out("[+] attacker IP blocked"));
    } else if (action === "status") {
      const score = evaluateHardening(next.hardening);
      logs.push(sys(`Firewall configuration: ${score.firewallOk ? "OK" : "INCOMPLETE"}`));
    } else logs.push(err("usage: firewall [status|allow|deny|blockip]"));
  } else if (command === "waf") {
    if (raw === "waf ratelimit set global 60") {
      next.hardening.waf.rateLimitValue = 60;
      logs.push(out("[+] global rate limit set to 60 req/min"));
    } else if (raw === "waf ruleset enable sqli_basic") {
      next.hardening.waf.rulesets.sqli_basic = true;
      logs.push(out("[+] ruleset enabled: sqli_basic"));
    } else if (args[1] === "enable") {
      next.hardening.waf.enabled = true;
      logs.push(out("[+] WAF enabled"));
    } else logs.push(err("usage: waf [enable|ratelimit|ruleset|status]"));
  } else if (command === "snort") {
    if (raw === "snort start") {
      next.hardening.snort.enabled = true;
      logs.push(out("[+] Snort engine started"));
    } else if (raw === "snort interface eth0") {
      next.hardening.snort.interface = "eth0";
      logs.push(out("[+] monitoring interface set to eth0"));
    } else if (raw === "snort rules enable scan.rules") {
      next.hardening.snort.rules["scan.rules"] = true;
      logs.push(out("[+] rule enabled: scan.rules"));
    } else if (raw === "snort rules enable malware.rules") {
      next.hardening.snort.rules["malware.rules"] = true;
      logs.push(out("[+] rule enabled: malware.rules"));
    } else if (raw === "snort rules disable local.rules") {
      next.hardening.snort.rules["local.rules"] = false;
      logs.push(out("[+] rule disabled: local.rules"));
    } else if (raw === "snort threshold scan --rate 10 --window 1 --track src_ip") {
      next.hardening.snort.scanPolicy = { count: 10, interval: 1, track: "src_ip" };
      logs.push(out("[+] IDS policy applied"));
    } else logs.push(err("usage: snort [start|interface|rules|threshold]"));
  } else if (command === "submit" || raw === challenge.flag || raw === `FLAG{${challenge.flag}}`) {
    return submitFlag(next, logs, challenge, command === "submit" ? args[1] : raw);
  } else {
    logs.push(err(`command not found: ${command}`));
  }

  if (challenge.order === 9 && !next.solved) {
    const score = evaluateHardening(next.hardening);
    if (score.allOk) {
      logs.push(sys("HARDENING COMPLETE. UNLOCKING FLAG."));
      logs.push(out(`FLAG{${challenge.flag}}`));
    }
  }

  return { next, logs };
};
