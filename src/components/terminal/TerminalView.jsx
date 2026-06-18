import { useEffect, useRef } from "react";
import { CircleDot, Lock, Sparkles, Terminal } from "lucide-react";

const logColor = {
  err: "text-[#ff8fa1]",
  in: "text-[#e7edf5]",
  out: "text-[#9fb0c4]",
  sys: "text-[#7de8ff]",
};

export function TerminalView({
  logs,
  value,
  onChange,
  onSubmit,
  disabled,
  prompt,
  suggestions = [],
  onUseSuggestion,
}) {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section
      className="flex min-h-[640px] min-w-0 flex-col overflow-hidden rounded-lg border border-[#314255] bg-[#080d13] shadow-[0_18px_48px_rgba(0,0,0,0.28)]"
      onClick={() => inputRef.current?.focus()}
    >
      <header className="flex min-h-11 items-center justify-between border-b border-[#314255] bg-[#101826] px-3.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#e7edf5]">
          <Terminal className="text-[#00b8d9]" size={16} />
          <span>{prompt}</span>
        </div>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff3b5c]" />
          <span className="size-2.5 rounded-full bg-[#facc15]" />
          <span className="size-2.5 rounded-full bg-[#00d97e]" />
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-[#1d2a38] bg-[#0c121b] px-3.5 py-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-[#7de8ff]">
          <Sparkles size={13} />
          Suggested
        </span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="max-w-full truncate rounded-md border border-[#314255] bg-[#101826] px-2.5 py-1 font-mono text-xs text-[#e7edf5] transition hover:border-[#00b8d9] hover:text-[#7de8ff] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={disabled}
            onClick={() => onUseSuggestion?.(suggestion)}
            title={suggestion}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="relative min-h-0 flex-1 overflow-y-auto px-4 py-3 font-mono text-sm leading-6"
        aria-live="polite"
      >
        {disabled && (
          <div className="mb-3 rounded-lg border border-[#314255] bg-[#101826] px-3 py-2 font-sans text-sm text-[#9fb0c4]">
            Target offline. Start the VM to enable command input.
          </div>
        )}
        {logs.map((log, index) => (
          <div
            key={`${index}-${log.msg}`}
            className={`grid grid-cols-[1.2rem_minmax(0,1fr)] gap-2 ${logColor[log.type] || logColor.out}`}
          >
            <span className="select-none text-[#6f8196]">{log.type === "in" ? "$" : ">"}</span>
            <p className="m-0 whitespace-pre-wrap break-words">{log.msg}</p>
          </div>
        ))}
      </div>

      <form
        className="flex min-h-12 items-center gap-2 border-t border-[#314255] bg-[#101826] px-4 font-mono text-sm"
        onSubmit={onSubmit}
      >
        <span className="text-[#00b8d9]">{disabled ? "#" : "$"}</span>
        <input
          className="min-w-0 flex-1 border-0 bg-transparent text-[#e7edf5] outline-none disabled:text-[#6f8196]"
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          spellCheck="false"
          autoCapitalize="none"
          autoComplete="off"
          aria-label="Commande terminal"
        />
        {disabled ? (
          <Lock className="text-[#6f8196]" size={15} />
        ) : (
          <CircleDot className="text-[#00d97e]" size={15} />
        )}
      </form>
    </section>
  );
}
