export const domains = [
  {
    id: "cyber",
    title: "Cyber Security",
    tagline: "Offensive and defensive security labs",
    accent: "#9fef00",
    available: true,
    grades: ["Recruit", "Operator", "Specialist", "Elite"],
  },
  {
    // Curriculum is published but its rooms are still being authored.
    id: "ai",
    title: "AI Engineering",
    tagline: "Machine learning, LLM apps and agents",
    accent: "#a970ff",
    available: true,
    preview: true,
    grades: ["Apprentice", "Builder", "Engineer", "Architect"],
  },
  {
    id: "quant",
    title: "Quant Trading",
    tagline: "Strategies, backtesting and paper trading",
    accent: "#f5b942",
    available: false,
  },
];

export const defaultDomainId = "cyber";

export const getDomainById = (id) =>
  domains.find((domain) => domain.id === id) || domains.find((domain) => domain.id === defaultDomainId);
