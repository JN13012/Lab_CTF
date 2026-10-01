import heroImage from "../../assets/web/hero.webp";
import genericLabImage from "../../assets/web/generic.webp";
import reconImage from "../../assets/web/recon.webp";
import linuxImage from "../../assets/web/linux.webp";
import networkImage from "../../assets/web/network.webp";
import webImage from "../../assets/web/web.webp";
import passwordsImage from "../../assets/web/passwords.webp";
import exploitationImage from "../../assets/web/exploitation.webp";
import socImage from "../../assets/web/soc.webp";
import forensicImage from "../../assets/web/forensic.webp";
import hardeningImage from "../../assets/web/hardening.webp";
import examImage from "../../assets/web/exam.webp";
import labLogo from "../../assets/brand/favicon.png";
import aiEmblem from "../../assets/brand/domain-ai-hero.webp";

export { examImage, genericLabImage, heroImage, labLogo };

export const roomImages = {
  footprinting: reconImage,
  "linux-commands": linuxImage,
  "service-scanning": networkImage,
  "web-sqli": webImage,
  bruteforce: passwordsImage,
  metasploit: exploitationImage,
  siem: socImage,
  forensic: forensicImage,
  hardening: hardeningImage,
};

const moduleImages = {
  reconnaissance: networkImage,
  exploitation: exploitationImage,
  defense: hardeningImage,
};

// Areas without illustrations yet (AI) get icon tiles instead of photos.
export const getModuleImage = (module) => moduleImages[module?.id] || null;

export const areaEmblems = {
  ai: aiEmblem,
};
