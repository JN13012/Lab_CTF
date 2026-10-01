import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, LineChart } from "lucide-react";
import { domains } from "../../ctf/data";
import aiEmblem from "../../../assets/brand/domain-ai.webp";
import cyberEmblem from "../../../assets/brand/domain-cyber.webp";

const domainEmblems = {
  cyber: cyberEmblem,
  ai: aiEmblem,
};

const domainIcons = {
  quant: LineChart,
};

function DomainIcon({ domain }) {
  const emblem = domainEmblems[domain.id];
  if (emblem) {
    return (
      <img
        src={emblem}
        alt=""
        draggable="false"
        className="size-11 shrink-0 object-contain"
        style={{ opacity: domain.available ? 1 : 0.55 }}
      />
    );
  }

  const Icon = domainIcons[domain.id];
  return (
    <span
      className="grid size-11 shrink-0 place-items-center rounded-lg"
      style={{
        color: domain.accent,
        background: `color-mix(in srgb, ${domain.accent} 14%, transparent)`,
        opacity: domain.available ? 1 : 0.55,
      }}
    >
      <Icon size={19} />
    </span>
  );
}

export function DomainSwitcher({ activeDomainId, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const active = domains.find((domain) => domain.id === activeDomainId) || domains[0];

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (event.type === "keydown" ? event.key === "Escape" : !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="domain-switcher"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Learning area: ${active.title}. Switch area`}
      >
        <span className="text-[15px] font-semibold text-[var(--text)]">{active.title}</span>
        <ChevronDown size={16} className={`text-[var(--text-muted)] transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div role="menu" className="absolute left-0 top-[calc(100%+8px)] z-40 w-80 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] panel p-2 shadow-2xl">
          <span className="block px-3 pb-2 pt-1 label-mono text-[var(--text-faint)]">
            Switch learning area
          </span>
          {domains.map((domain) => {
            const isActive = domain.id === active.id;
            return (
              <button
                key={domain.id}
                type="button"
                role="menuitem"
                disabled={!domain.available}
                onClick={() => {
                  onSelect(domain.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition enabled:hover:bg-[var(--surface-hover)] disabled:cursor-default ${
                  isActive ? "bg-[var(--surface-hover)]" : ""
                }`}
              >
                <DomainIcon domain={domain} />
                <span className="min-w-0 flex-1">
                  <strong className={`block text-sm font-semibold ${domain.available ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                    {domain.title}
                  </strong>
                  <span className="block truncate text-xs text-[var(--text-muted)]">{domain.tagline}</span>
                </span>
                {isActive ? (
                  <Check size={16} style={{ color: domain.accent }} />
                ) : !domain.available ? (
                  <span className="status status-locked">Coming soon</span>
                ) : (
                  domain.preview && (
                    <span
                      className="status"
                      style={{ color: domain.accent, background: `color-mix(in srgb, ${domain.accent} 14%, transparent)` }}
                    >
                      Preview
                    </span>
                  )
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
