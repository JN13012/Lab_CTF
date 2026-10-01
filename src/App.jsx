import { useEffect, useMemo, useRef, useState } from "react";
import { runCommand } from "./ctf/terminal/terminalEngine";
import { bootLogs, createInitialRuntime } from "./ctf/runtime";
import { challenges, getChallengeById, getChallengeByOrder, getDomainById } from "./ctf/data";
import { checkAnswer, getCurrentRoomStats, getRoomStatus } from "./ctf/selectors";
import { labLogo } from "./assets/images";
import { capLogs, clearSavedState, loadSavedState, saveState } from "./app/storage";
import { PageHeader } from "./components/layout/PageHeader";
import { Toast } from "./components/layout/Toast";
import { TopNav } from "./components/layout/TopNav";
import { ViewRenderer } from "./router/ViewRenderer";
import { viewKickers, viewTitles } from "./router/views";

function App() {
  const saved = loadSavedState();
  const [runtime, setRuntime] = useState(() => {
    if (!saved?.runtime) return createInitialRuntime();

    const migratedActiveRoom =
      saved.runtime.activeRoomId ||
      getChallengeByOrder(saved.runtime.level || 1)?.id ||
      challenges[0].id;
    const migratedCompletedRooms =
      saved.runtime.completedRooms ||
      challenges
        .filter((challenge) => challenge.order < (saved.runtime.level || 1))
        .map((challenge) => challenge.id);

    const savedRuntime = { ...saved.runtime };
    delete savedRuntime["training" + "Mode"];

    return {
      ...createInitialRuntime(),
      ...savedRuntime,
      activeRoomId: migratedActiveRoom,
      completedRooms: migratedCompletedRooms,
      roomStats: saved.runtime.roomStats || {},
      notes: saved.runtime.notes || {},
      answers: saved.runtime.answers || {},
      completedAt: saved.runtime.completedAt || {},
      solved: migratedCompletedRooms.length >= challenges.length,
    };
  });
  const [logs, setLogs] = useState(saved?.logs || bootLogs);
  const [command, setCommand] = useState("");
  const [view, setView] = useState("dashboard");
  const [vmState, setVmState] = useState("stopped");
  const [searchQuery, setSearchQuery] = useState("");
  const [returnView, setReturnView] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const activeRoom = getChallengeById(runtime.activeRoomId) || challenges[0];
  const activeRoomStats = getCurrentRoomStats(runtime, activeRoom.id);
  const activeRoomNote = runtime.notes?.[activeRoom.id] || "";
  const completedCount = runtime.completedRooms?.length || 0;
  const prompt = runtime.solved
    ? "ROOT@LAB:~#"
    : runtime.remoteSession?.type === "msfconsole"
      ? "MSF6 >"
      : runtime.remoteSession?.type === "meterpreter"
        ? "METERPRETER >"
        : `room-${String(activeRoom.order).padStart(2, "0")}`;

  const visibleLogs = useMemo(
    () => logs.filter((log) => log.type !== "control"),
    [logs],
  );

  const viewTitle = view === "room" ? activeRoom.title : viewTitles[view];
  const viewKicker = viewKickers[view];
  const activeDomain = getDomainById(runtime.activeDomainId);

  useEffect(() => {
    let icon = document.querySelector("link[rel='icon']");
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      document.head.appendChild(icon);
    }
    icon.href = labLogo;
  }, []);

  useEffect(() => {
    saveState({ runtime, logs });
  }, [runtime, logs]);

  useEffect(() => () => {
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
  }, []);

  const appendLogs = (newLogs) => {
    if (newLogs.some((log) => log.msg === "__CLEAR__")) {
      setLogs(bootLogs);
      return;
    }
    setLogs((current) => capLogs([...current, ...newLogs]));
  };

  const showToast = (message, type = "info") => {
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 1800);
  };

  const openRoom = (order, backTarget = "tracks") => {
    const room = getChallengeByOrder(order);
    if (!room) return;

    if (getRoomStatus(runtime, room) === "locked") {
      showToast("Complete the previous rooms to unlock this one.");
      return;
    }

    showToast(`Preparing ${room.title}...`);

    window.setTimeout(() => {
      setRuntime((current) => ({
        ...current,
        activeRoomId: room.id,
        level: order,
        remoteSession: null,
        sshLoginPending: null,
      }));
      setLogs([
        ...bootLogs,
        { msg: `Selected room: ${room.title}`, type: "sys" },
        { msg: "Start the target machine to enable the terminal.", type: "sys" },
      ]);
      setCommand("");
      setVmState("stopped");
      setReturnView(backTarget);
      setView("room");
      showToast(`${room.title} ready`, "success");
    }, 650);
  };

  const bootVm = () => {
    if (vmState !== "stopped") return;

    setVmState("booting");
    showToast("Spawning target machine...");
    setLogs((current) => capLogs([
      ...current,
      { msg: "[*] starting target machine...", type: "sys" },
      { msg: `[*] loading image: ${activeRoom.id}`, type: "sys" },
    ]));

    window.setTimeout(() => {
      showToast(`Target online: ${activeRoom.targetIp || "local-sim"}`, "success");
      setVmState("running");
      setLogs((current) => capLogs([
        ...current,
        { msg: `[+] Target machine online: ${activeRoom.targetIp || "local-sim"}`, type: "sys" },
        { msg: "TYPE 'help' TO START THE CHALLENGE.", type: "sys" },
      ]));
    }, 1200);
  };

  const stopVm = () => {
    if (vmState !== "running") return;

    setVmState("stopped");
    setRuntime((current) => ({ ...current, remoteSession: null, sshLoginPending: null }));
    setLogs((current) => capLogs([...current, { msg: "[*] target machine stopped.", type: "sys" }]));
    showToast("Target machine stopped");
  };

  const executeCommand = (value) => {
    const result = runCommand(runtime, value);
    const solved = (result.next.completedRooms?.length || 0) > completedCount;
    setRuntime(
      solved
        ? {
            ...result.next,
            completedAt: { ...(result.next.completedAt || {}), [activeRoom.id]: new Date().toISOString() },
          }
        : result.next,
    );
    appendLogs(result.logs);

    if (solved) showToast(`${activeRoom.title} completed`, "success");
    return solved;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = command.trim();
    if (!value) return;

    executeCommand(value);
    setCommand("");
  };

  const submitFlag = (value) => {
    const candidate = value.trim();
    if (!candidate) return false;
    return executeCommand(`submit ${candidate}`);
  };

  const answerQuestion = (question, value = "") => {
    if (question.kind === "flag") return submitFlag(value);
    if (question.kind !== "ack" && !checkAnswer(question, value)) return false;

    setRuntime((current) => {
      const answered = current.answers?.[activeRoom.id] || [];
      if (answered.includes(question.id)) return current;
      return {
        ...current,
        answers: { ...(current.answers || {}), [activeRoom.id]: [...answered, question.id] },
      };
    });
    return true;
  };

  const revealHint = () => {
    setRuntime((current) => {
      const stats = getCurrentRoomStats(current, activeRoom.id);
      return {
        ...current,
        roomStats: {
          ...(current.roomStats || {}),
          [activeRoom.id]: {
            ...stats,
            hints: stats.hints + 1,
          },
        },
      };
    });
    showToast("Hint revealed", "success");
  };

  const updateRoomNotes = (value) => {
    setRuntime((current) => ({
      ...current,
      notes: {
        ...(current.notes || {}),
        [activeRoom.id]: value,
      },
    }));
  };

  const selectDomain = (domainId) => {
    const domain = getDomainById(domainId);
    if (!domain.available || domain.id === runtime.activeDomainId) return;
    setRuntime((current) => ({ ...current, activeDomainId: domain.id }));
    setView("dashboard");
    showToast(`Switched to ${domain.title}`, "success");
  };

  const resetLab = () => {
    const confirmed = window.confirm("Reset all progress and terminal history?");
    if (!confirmed) return;

    setRuntime(createInitialRuntime());
    setLogs(bootLogs);
    setCommand("");
    setView("dashboard");
    setVmState("stopped");
    setReturnView("dashboard");
    setSearchQuery("");
    clearSavedState();
  };

  return (
    <main className="app-shell" style={{ "--accent": activeDomain.accent }}>
      <Toast toast={toast} />
      <TopNav
        view={view}
        runtime={runtime}
        activeDomainId={activeDomain.id}
        searchQuery={searchQuery}
        onNavigate={setView}
        onSelectDomain={selectDomain}
        onSearchChange={setSearchQuery}
      />
      <div className="content-shell">
        {!["room", "dashboard"].includes(view) && <PageHeader kicker={viewKicker} title={viewTitle} />}
        <div key={`${activeDomain.id}-${view === "room" ? activeRoom.id : view}`} className="view-enter">
        <ViewRenderer
          view={view}
          runtime={runtime}
          searchQuery={searchQuery}
          activeRoom={activeRoom}
          activeRoomStats={activeRoomStats}
          activeRoomNote={activeRoomNote}
          visibleLogs={visibleLogs}
          command={command}
          prompt={prompt}
          vmState={vmState}
          returnView={returnView}
          onSetView={setView}
          onOpenRoom={openRoom}
          onBoot={bootVm}
          onStopVm={stopVm}
          onRevealHint={revealHint}
          onNotesChange={updateRoomNotes}
          onCommandChange={setCommand}
          onCommandSubmit={handleSubmit}
          onAnswerQuestion={answerQuestion}
          onReset={resetLab}
        />
        </div>
      </div>
    </main>
  );
}

export default App;
