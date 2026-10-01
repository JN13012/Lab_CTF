export const levels = [
  {
    id: "n1",
    domainId: "cyber",
    number: 1,
    title: "Recruit",
    subtitle: "Attack & Defend",
    summary: "Discover a target, attack it, then switch sides to investigate and harden it.",
    exam: {
      title: "Final exam",
      summary: "Practical assessment on an unknown machine, with a written report.",
      certificate: "Recruit certificate",
      available: false,
    },
  },
  {
    id: "ai1",
    domainId: "ai",
    number: 1,
    title: "Apprentice",
    subtitle: "Foundations",
    summary: "The core ideas behind modern AI, then the Python and data skills every AI project starts with.",
    exam: {
      title: "Final project",
      summary: "Collect, clean and analyse a real dataset, then present what you found.",
      certificate: "Apprentice certificate",
      available: false,
    },
  },
];

export const modules = [
  {
    id: "reconnaissance",
    levelId: "n1",
    title: "Reconnaissance",
    summary: "Read what a target exposes before touching anything.",
    roomIds: ["footprinting", "linux-commands", "service-scanning"],
    prerequisites: [],
    estimatedHours: 4,
  },
  {
    id: "exploitation",
    levelId: "n1",
    title: "Exploitation",
    summary: "Turn what you found into access, step by step.",
    roomIds: ["web-sqli", "bruteforce", "metasploit"],
    prerequisites: ["reconnaissance"],
    estimatedHours: 7,
  },
  {
    id: "defense",
    levelId: "n1",
    title: "Detection & Response",
    summary: "Switch sides: detect the attack, investigate it and close the gaps.",
    roomIds: ["siem", "forensic", "hardening"],
    prerequisites: ["exploitation"],
    estimatedHours: 7,
  },
  {
    id: "ai-foundations",
    levelId: "ai1",
    title: "AI Foundations",
    summary: "What AI is, how models learn, and how to talk to them.",
    roomIds: ["ai-how-machines-learn", "ai-neural-networks", "ai-prompting"],
    prerequisites: [],
    estimatedHours: 4,
  },
  {
    id: "python-for-ai",
    levelId: "ai1",
    title: "Python for AI",
    summary: "The language and the two libraries every AI project starts with.",
    roomIds: ["ai-python-essentials", "ai-numpy", "ai-pandas"],
    prerequisites: ["ai-foundations"],
    estimatedHours: 6,
  },
  {
    id: "data-collection",
    levelId: "ai1",
    title: "Data Collection",
    summary: "Get data from the web and turn it into something a model can use.",
    roomIds: ["ai-apis", "ai-web-scraping", "ai-file-formats"],
    prerequisites: ["python-for-ai"],
    estimatedHours: 6,
  },
];

export const difficultyPoints = {
  Intro: 10,
  Easy: 20,
  Medium: 40,
  Hard: 80,
};

export const ranks = [
  { name: "Noob", minPoints: 0 },
  { name: "Script Kiddie", minPoints: 30 },
  { name: "Hacker", minPoints: 100 },
  { name: "Pro Hacker", minPoints: 200 },
  { name: "Elite Hacker", minPoints: 300 },
  { name: "Guru", minPoints: 370 },
];

export const getModuleById = (id) => modules.find((module) => module.id === id);

export const getLevelModules = (levelId) =>
  modules.filter((module) => module.levelId === levelId);

export const getModuleForRoom = (roomId) =>
  modules.find((module) => module.roomIds.includes(roomId));

export const getModuleNumber = (module) =>
  getLevelModules(module?.levelId).findIndex((item) => item.id === module?.id) + 1;
