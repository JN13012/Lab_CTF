export const trainingModes = [
  {
    id: "guided",
    label: "Guided",
    description: "Methodology and hints are available.",
  },
  {
    id: "challenge",
    label: "Challenge",
    description: "No hints. Solve it with your own methodology.",
  },
];

export function getRoomStatus(runtime, challenge) {
  if (runtime.completedRooms?.includes(challenge.id)) return "completed";
  return "available";
}

export function getMethodology(room) {
  const base = ["Read the scope and objective", "Enumerate before exploiting", "Keep useful notes", "Submit the flag"];
  const byCategory = {
    Recon: ["Identify visible artifacts", "List hidden files", "Document exposed information"],
    Linux: ["List files recursively", "Search by filename", "Search inside file contents"],
    Network: ["Run service enumeration", "Map exposed ports", "Validate interesting services"],
    Web: ["Map endpoints", "Test authentication flow", "Confirm injection safely"],
    Cracking: ["Identify hash material", "Crack credentials", "Validate access path"],
    Exploitation: ["Confirm vulnerable service", "Select exploit path", "Escalate and verify privileges"],
    SOC: ["Query event volume", "Pivot on suspicious telemetry", "Extract attacker indicator"],
    "Incident Response": ["Inspect suspicious artifacts", "Map process to connection", "Contain persistence"],
    Defense: ["Reduce exposed services", "Apply WAF controls", "Deploy detection policy"],
  };

  return byCategory[room.category] || base;
}
