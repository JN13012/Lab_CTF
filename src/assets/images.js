import heroImage from "../../assets/Premium cybersecurity training platform interface background.png";
import genericLabImage from "../../assets/Dark cyber training platform.png";
import reconImage from "../../assets/Dark cybersecurity reconnaissance lab scene.png";
import portScanImage from "../../assets/Stylized port scanning visualization.png";
import webSecurityImage from "../../assets/Professional web application security lab visual.png";
import sqliImage from "../../assets/SQL injection cybersecurity lab visual.png";
import crackingImage from "../../assets/Password cracking cybersecurity lab visual.png";
import exploitationImage from "../../assets/Cyber exploitation training lab visual.png";
import socImage from "../../assets/SOC analyst training lab background.png";
import forensicImage from "../../assets/Digital forensic investigation lab visual.png";
import hardeningImage from "../../assets/Cyber defense hardening lab visual.png";
import linuxImage from "../../assets/Linux fundamentals cybersecurity lab visual.png";
import labLogo from "../../assets/Minimal favicon icon for cybersecurity training lab.png";

export { genericLabImage, heroImage, labLogo };

export const domainImages = {
  recon: reconImage,
  web: webSecurityImage,
  cracking: crackingImage,
  exploitation: exploitationImage,
  soc: socImage,
  forensic: forensicImage,
  hardening: hardeningImage,
};

export const roomImages = {
  footprinting: reconImage,
  "linux-commands": linuxImage,
  "service-scanning": portScanImage,
  "web-sqli": sqliImage,
  bruteforce: crackingImage,
  metasploit: exploitationImage,
  siem: socImage,
  forensic: forensicImage,
  hardening: hardeningImage,
};
