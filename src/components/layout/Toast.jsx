import { ShieldCheck } from "lucide-react";

export function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div
      className={`fixed right-4 top-4 z-50 flex min-w-59 max-w-[calc(100vw-36px)] items-center gap-2.5 rounded-lg border px-3.5 py-3 text-[#e7edf5] shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-sm ${
        toast.type === "success"
          ? "border-[#00d97e]/40 bg-[#111827]/95"
          : "border-[#40566f] bg-[#111827]/95"
      }`}
      role="status"
      aria-live="polite"
    >
      {toast.type === "success" ? (
        <ShieldCheck className="shrink-0 text-[#00b8d9]" size={18} />
      ) : (
        <span
          className="size-5 shrink-0 animate-spin rounded-full border-2 border-white/20 border-t-white"
          aria-hidden="true"
        />
      )}
      <span className="grid gap-0.5">
        <strong className="text-[0.84rem] text-[#e7edf5]">
          {toast.type === "success" ? "Ready" : "Loading"}
        </strong>
        <small className="text-[0.78rem] text-[#9fb0c4]">{toast.message}</small>
      </span>
    </div>
  );
}
