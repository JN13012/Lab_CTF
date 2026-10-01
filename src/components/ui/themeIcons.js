import { BrainCircuit, Code2, Database, Radar, Shield, Swords } from "lucide-react";

export const moduleIcons = {
  reconnaissance: Radar,
  exploitation: Swords,
  defense: Shield,
  "ai-foundations": BrainCircuit,
  "python-for-ai": Code2,
  "data-collection": Database,
};

export const moduleColors = {
  reconnaissance: "var(--info)",
  exploitation: "var(--warning)",
  defense: "var(--violet)",
  "ai-foundations": "var(--violet)",
  "python-for-ai": "var(--info)",
  "data-collection": "var(--warning)",
};

export const moduleMarkers = {
  reconnaissance: "circle",
  exploitation: "diamond",
  defense: "hexagon",
  "ai-foundations": "circle",
  "python-for-ai": "diamond",
  "data-collection": "hexagon",
};
