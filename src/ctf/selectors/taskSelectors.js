import { roomTasks } from "../data/roomTasks.js";
import { getMethodology } from "./roomSelectors.js";

function defaultTasks(room) {
  return [
    {
      id: "briefing",
      title: "Briefing",
      body: [
        { type: "p", text: room.scenario },
        { type: "p", text: room.objective },
      ],
      questions: [{ id: "ready", prompt: "Read the briefing above.", kind: "ack" }],
    },
    {
      id: "methodology",
      title: "Methodology",
      body: [{ type: "list", items: getMethodology(room) }],
      questions: [{ id: "plan", prompt: "Review the methodology before you start.", kind: "ack" }],
    },
    {
      id: "capture",
      title: "Capture the flag",
      machine: true,
      body: [
        {
          type: "p",
          text: "Start the target machine at the top of the room, then work in the terminal. Submit the flag once you have it.",
        },
      ],
      questions: [{ id: "flag", prompt: "What is the flag?", kind: "flag" }],
    },
  ];
}

export function getRoomTasks(room) {
  return roomTasks[room.id] || defaultTasks(room);
}

export function isQuestionAnswered(runtime, room, question) {
  if (question.kind === "flag") return runtime.completedRooms?.includes(room.id) || false;
  return runtime.answers?.[room.id]?.includes(question.id) || false;
}

export function isTaskDone(runtime, room, task) {
  return task.questions.every((question) => isQuestionAnswered(runtime, room, question));
}

export function getRoomTaskProgress(runtime, room) {
  const questions = getRoomTasks(room).flatMap((task) => task.questions);
  const answered = questions.filter((question) => isQuestionAnswered(runtime, room, question)).length;
  return { answered, total: questions.length, percent: Math.round((answered / questions.length) * 100) };
}

export function checkAnswer(question, value) {
  const normalized = value.trim().toLowerCase();
  return (question.answer || []).some((expected) => expected.toLowerCase() === normalized);
}
