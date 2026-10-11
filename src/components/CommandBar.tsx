import { useEffect, useRef } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
export function CommandBar({ value, onChange, onSubmit, onEscape, placeholder }: {
  value: string; onChange: (v: string) => void; onSubmit: (v: string) => void;
  onEscape?: () => void; placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") { e.preventDefault(); ref.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="flex items-center gap-2.5 border-b px-4"
      style={{ height: 48, background: "var(--surface)", borderColor: "var(--border)" }}>
      <MagnifyingGlass size={16} weight="regular" style={{ color: "var(--text-3)" }} />
      <input ref={ref} value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); onSubmit(value); }
          if (e.key === "Escape") { onEscape?.(); (e.target as HTMLInputElement).blur(); }
        }}
        placeholder={placeholder ?? "Type a path, or filter this folder…  ( / )"}
        spellCheck={false} autoComplete="off"
        className="flex-1 bg-transparent outline-none"
        style={{ fontSize: "var(--text-base)", color: "var(--text)" }}
      />
      {value && <span style={{ fontSize: "var(--text-xs)", color: "var(--text-3)" }}>esc</span>}
    </div>
  );
}
