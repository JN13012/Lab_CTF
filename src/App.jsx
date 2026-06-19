import { useEffect, useMemo, useRef, useState } from "react";
import { runCommand } from "./ctf/terminal/terminalEngine";
import { bootLogs, createInitialRuntime } from "./ctf/runtime";
import {
  challenges,
  domainCatalog,
  getChallengeById,
  getChallengeByOrder,
} from "./ctf/data";
import {
  getCurrentRoomStats,
  getDomainForRoom,
  getRoomStatus,
} from "./ctf/selectors";
import { labLogo } from "./assets/images";
import { capLogs, clearSavedState, loadSavedState, saveState } from "./app/storage";
import { AppHeader } from "./components/layout/AppHeader";
import { Sidebar } from "./components/layout/Sidebar";
import { Toast } from "./components/layout/Toast";
import { ViewRenderer } from "./router/ViewRenderer";
import { viewTitles } from "./router/views";

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

    return {
      ...createInitialRuntime(),
      ...saved.runtime,
      activeRoomId: migratedActiveRoom,
      completedRooms: migratedCompletedRooms,
      roomStats: saved.runtime.roomStats || {},
      notes: saved.runtime.notes || {},
      trainingMode: ["guided", "challenge"].includes(saved.runtime.trainingMode)
        ? saved.runtime.trainingMode
        : "guided",
      solved: migratedCompletedRooms.length >= challenges.length,
    };
  });
  const [logs, setLogs] = useState(saved?.logs || bootLogs);
  const [command, setCommand] = useState("");
  const [view, setView] = useState("dashboard");
  const [selectedDomainId, setSelectedDomainId] = useState(domainCatalog[0].id);
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

  const openTrack = (domainId) => {
    const domain = domainCatalog.find((item) => item.id === domainId);
    showToast(`Loading ${domain?.title || "learning path"}...`);
    window.setTimeout(() => {
      setSelectedDomainId(domainId);
      setView("track");
      showToast(`${domain?.title || "Training program"} loaded`, "success");
    }, 450);
  };

  const openRoom = (order, mode = "guided", backTarget = mode === "challenge" ? "challenges" : "track") => {
    const room = getChallengeByOrder(order);
    if (!room) return;

    if (getRoomStatus(runtime, room) === "locked") {
      showToast("Complete previous rooms to unlock this room.");
      return;
    }

    const domain = getDomainForRoom(room);
    showToast(`Preparing room: ${room.title}...`);

    window.setTimeout(() => {
      if (domain) setSelectedDomainId(domain.id);

      setRuntime((current) => ({
        ...current,
        activeRoomId: room.id,
        trainingMode: mode,
        level: order,
        remoteSession: null,
        sshLoginPending: null,
      }));
      setLogs([
        ...bootLogs,
        { msg: `Selected room: ${room.title}`, type: "sys" },
        { msg: "Start the VM to enable the terminal.", type: "sys" },
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
    showToast("Allocating target resources...");
    setLogs((current) => capLogs([
      ...current,
      { msg: "[*] allocating target resources...", type: "sys" },
      { msg: `[*] loading image: ${activeRoom.id}`, type: "sys" },
    ]));

    window.setTimeout(() => {
      showToast(`Target ready: ${activeRoom.targetIp || "local-sim"}`, "success");
      setVmState("running");
      setLogs((current) => capLogs([
        ...current,
        { msg: `[+] VM ready: ${activeRoom.targetIp || "local-sim"}`, type: "sys" },
        { msg: "TYPE 'help' TO START THE CHALLENGE.", type: "sys" },
      ]));
    }, 1200);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = command.trim();
    if (!value) return;

    const previousCompletedCount = completedCount;
    const result = runCommand(runtime, value);
    setRuntime(result.next);
    appendLogs(result.logs);
    setCommand("");

    if ((result.next.completedRooms?.length || 0) > previousCompletedCount) {
      showToast(`${activeRoom.title} completed`, "success");
    }
  };

  const updateTrainingMode = (mode) => {
    setRuntime((current) => ({
      ...current,
      trainingMode: mode,
    }));
  };

  const revealHint = () => {
    if (runtime.trainingMode === "challenge") return;

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

  const resetLab = () => {
    const confirmed = window.confirm("Reset all progress and terminal history?");
    if (!confirmed) return;

    const fresh = createInitialRuntime();
    setRuntime(fresh);
    setLogs(bootLogs);
    setCommand("");
    setView("dashboard");
    setVmState("stopped");
    setReturnView("dashboard");
    setSearchQuery("");
    setSelectedDomainId(domainCatalog[0].id);
    clearSavedState();
  };

  return (
    <main className="app-shell">
      <Toast toast={toast} />
      <Sidebar
        view={view}
        onNavigate={setView}
        completedCount={completedCount}
      />
      <div className="content-shell">
        <AppHeader
          viewTitle={viewTitle}
          runtime={runtime}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onReset={resetLab}
        />
        <ViewRenderer
          view={view}
          runtime={runtime}
          completedCount={completedCount}
          searchQuery={searchQuery}
          selectedDomainId={selectedDomainId}
          activeRoom={activeRoom}
          activeRoomStats={activeRoomStats}
          activeRoomNote={activeRoomNote}
          visibleLogs={visibleLogs}
          command={command}
          prompt={prompt}
          vmState={vmState}
          returnView={returnView}
          onSetView={setView}
          onSelectDomain={setSelectedDomainId}
          onOpenTrack={openTrack}
          onOpenRoom={openRoom}
          onBoot={bootVm}
          onTrainingModeChange={updateTrainingMode}
          onRevealHint={revealHint}
          onNotesChange={updateRoomNotes}
          onCommandChange={setCommand}
          onCommandSubmit={handleSubmit}
          onClearLogs={() => setLogs(bootLogs)}
          onReset={resetLab}
        />
      </div>
    </main>
  );
}

export default App;
