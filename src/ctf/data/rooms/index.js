import { bruteforce } from "./bruteforce.js";
import { footprinting } from "./footprinting.js";
import { forensic } from "./forensic.js";
import { hardening } from "./hardening.js";
import { linuxCommands } from "./linuxCommands.js";
import { metasploit } from "./metasploit.js";
import { serviceScanning } from "./serviceScanning.js";
import { siem } from "./siem.js";
import { webSqli } from "./webSqli.js";

export const challenges = [
  footprinting,
  linuxCommands,
  serviceScanning,
  webSqli,
  bruteforce,
  metasploit,
  siem,
  forensic,
  hardening,
];

export {
  bruteforce,
  footprinting,
  forensic,
  hardening,
  linuxCommands,
  metasploit,
  serviceScanning,
  siem,
  webSqli,
};
