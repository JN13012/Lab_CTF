import { bruteforce } from "./bruteforce";
import { footprinting } from "./footprinting";
import { forensic } from "./forensic";
import { hardening } from "./hardening";
import { linuxCommands } from "./linuxCommands";
import { metasploit } from "./metasploit";
import { serviceScanning } from "./serviceScanning";
import { siem } from "./siem";
import { webSqli } from "./webSqli";

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
