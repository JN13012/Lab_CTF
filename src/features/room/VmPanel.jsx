import { Loader2, Play, Server, Square } from "lucide-react";

const stateLabel = {
  stopped: "Offline",
  booting: "Starting",
  running: "Online",
};

export function VmPanel({ room, vmState, onBoot, onStop }) {
  const isRunning = vmState === "running";
  const isBooting = vmState === "booting";
  const dotColor = isRunning ? "var(--success)" : isBooting ? "var(--warning)" : "var(--text-faint)";

  return (
    <section
      className={`flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border bg-[var(--surface)] panel px-5 py-4 ${
        isRunning ? "border-[var(--accent)]/50" : "border-[var(--border)]"
      }`}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--surface-sunken)] text-[var(--text-muted)]">
        <Server size={20} />
      </span>

      <div className="min-w-0">
        <span className="block label-mono text-[var(--text-faint)]">Target machine</span>
        <span className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
          <span className={`size-2 rounded-full ${isBooting ? "animate-pulse" : ""}`} style={{ background: dotColor }} />
          {stateLabel[vmState]}
        </span>
      </div>

      <div className="min-w-0">
        <span className="block label-mono text-[var(--text-faint)]">IP address</span>
        <span className="mt-0.5 block font-mono text-sm text-[var(--text)]">
          {isRunning ? room.targetIp || "local-sim" : "—"}
        </span>
      </div>

      <div className="ml-auto">
        {isRunning ? (
          <button type="button" className="button" onClick={onStop}>
            <Square size={13} fill="currentColor" className="text-[var(--danger)]" />
            Stop machine
          </button>
        ) : (
          <button
            type="button"
            className="button primary-button disabled:cursor-wait"
            onClick={onBoot}
            disabled={isBooting}
          >
            {isBooting ? <Loader2 size={16} className="animate-spin" /> : <Play size={15} fill="currentColor" />}
            {isBooting ? "Starting..." : "Start machine"}
          </button>
        )}
      </div>
    </section>
  );
}
