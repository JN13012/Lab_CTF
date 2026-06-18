import { Clock, Cpu, Database, Network, Play, Server } from "lucide-react";

export function VmPanel({ room, vmState, onBoot }) {
  const surface =
    room.services?.length || room.directories?.length || Object.keys(room.files).length;
  const exposedServices = room.services?.length || 0;
  const artifacts = Object.keys(room.files).length + (room.directories?.length || 0);

  return (
    <aside className="grid gap-4">
      <section className="rounded-lg border border-[#314255] bg-[#101826] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <div
          className={`mb-3 size-3 rounded-full ${
            vmState === "running"
              ? "bg-[#00d97e] shadow-[0_0_18px_rgba(0,217,126,0.45)]"
              : vmState === "booting"
                ? "bg-[#facc15] shadow-[0_0_18px_rgba(250,204,21,0.45)]"
                : "bg-[#ff3b5c] shadow-[0_0_18px_rgba(255,59,92,0.35)]"
          }`}
        />
        <span className="block text-xs font-semibold uppercase tracking-normal text-[#9fb0c4]">
          Target VM
        </span>
        <h2 className="m-0 mt-1 text-xl font-semibold text-[#e7edf5]">
          {room.id.replaceAll("-", "_")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#9fb0c4]">
          {vmState === "running"
            ? "Target VM is online and ready for interaction."
            : vmState === "booting"
              ? "Provisioning target environment."
              : "Start the VM to unlock the terminal."}
        </p>
        <button
          type="button"
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#00b8d9]/60 bg-[linear-gradient(135deg,#00b8d9,#4aa3ff)] px-3 text-sm font-extrabold text-[#061119] transition disabled:border-[#314255] disabled:bg-[#203047] disabled:bg-none disabled:text-[#6f8196]"
          onClick={onBoot}
          disabled={vmState !== "stopped"}
        >
          <Play size={17} />
          {vmState === "stopped" ? "Start VM" : vmState}
        </button>
      </section>

      <section className="grid gap-2 rounded-lg border border-[#314255] bg-[#101826] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-2 rounded-lg border border-[#314255] bg-[#080d13] p-3">
          <Server className="row-span-2 text-[#00b8d9]" size={17} />
          <span className="text-xs text-[#9fb0c4]">Target IP</span>
          <strong className="text-sm text-[#e7edf5]">{room.targetIp || "local-sim"}</strong>
        </div>
        <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-2 rounded-lg border border-[#314255] bg-[#080d13] p-3">
          <Cpu className="row-span-2 text-[#00b8d9]" size={17} />
          <span className="text-xs text-[#9fb0c4]">Surface</span>
          <strong className="text-sm text-[#e7edf5]">{surface}</strong>
        </div>
        <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-2 rounded-lg border border-[#314255] bg-[#080d13] p-3">
          <Network className="row-span-2 text-[#00b8d9]" size={17} />
          <span className="text-xs text-[#9fb0c4]">Services</span>
          <strong className="text-sm text-[#e7edf5]">{exposedServices}</strong>
        </div>
        <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-2 rounded-lg border border-[#314255] bg-[#080d13] p-3">
          <Clock className="row-span-2 text-[#00b8d9]" size={17} />
          <span className="text-xs text-[#9fb0c4]">Estimate</span>
          <strong className="text-sm text-[#e7edf5]">20 min</strong>
        </div>
        <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-2 rounded-lg border border-[#314255] bg-[#080d13] p-3">
          <Database className="row-span-2 text-[#00b8d9]" size={17} />
          <span className="text-xs text-[#9fb0c4]">Artifacts</span>
          <strong className="text-sm text-[#e7edf5]">{artifacts}</strong>
        </div>
      </section>
    </aside>
  );
}
