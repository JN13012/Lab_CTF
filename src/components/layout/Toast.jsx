import { ShieldCheck } from "lucide-react";

export function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div
      className={`fixed right-4 top-4 z-50 flex min-w-59 max-w-[calc(100vw-36px)] items-center gap-2.5 rounded-lg border px-3.5 py-3 text-[var(--text)] shadow-md  ${
        toast.type === "success"
          ? "border-[var(--border)] bg-[var(--surface)]"
          : "border-[var(--border-strong)] bg-[var(--surface)]"
      }`}
      role="status"
      aria-live="polite"
    >
      {toast.type === "success" ? (
        <ShieldCheck className="shrink-0 text-[var(--accent)]" size={18} />
      ) : (
        <span
          className="size-5 shrink-0 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]"
          aria-hidden="true"
        />
      )}
      <span className="grid gap-0.5">
        <strong className="text-[0.84rem] text-[var(--text)]">
          {toast.type === "success" ? "Success" : "Loading"}
        </strong>
        <small className="text-[0.78rem] text-[var(--text-muted)]">{toast.message}</small>
      </span>
    </div>
  );
}
