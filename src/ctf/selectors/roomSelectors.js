import { challenges } from "../data/index.js";

export function getRoomStatus(runtime, challenge) {
  if (!challenge) return "locked";
  if (challenge.planned) return "soon";
  if (runtime.completedRooms?.includes(challenge.id)) return "completed";

  const previousRooms = challenges.filter((room) => room.order < challenge.order);
  const previousRoomsCompleted = previousRooms.every((room) =>
    runtime.completedRooms?.includes(room.id),
  );

  return challenge.order === 1 || previousRoomsCompleted ? "available" : "locked";
}

export function getMethodology(room) {
  const base = ["Read the scope and objective", "Enumerate before acting", "Keep useful notes", "Submit the flag"];
  const byCategory = {
    Recon: ["Identify visible artifacts", "List hidden files", "Document exposed information"],
    Linux: ["List files recursively", "Search by filename", "Search inside file contents"],
    Network: ["Enumerate services", "Map exposed ports", "Validate interesting services"],
    Web: ["Map the endpoints", "Test the authentication flow", "Confirm the finding without impact"],
    Cracking: ["Identify recovered hashes", "Recover credentials", "Validate the access path"],
    Exploitation: ["Confirm the vulnerable service", "Pick the right approach", "Verify the privileges obtained"],
    SOC: ["Measure event volume", "Pivot on suspicious telemetry", "Extract the attacker indicator"],
    "Incident Response": ["Inspect suspicious artifacts", "Map process to connection", "Contain persistence"],
    Defense: ["Reduce exposed services", "Apply WAF rules", "Deploy the detection policy"],
  };

  return byCategory[room.category] || base;
}
