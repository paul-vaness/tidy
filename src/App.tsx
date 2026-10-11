import { useCallback, useEffect, useMemo, useState } from "react";
import { fs, type Entry, type Listing } from "@/lib/fs";
import { parseCommand } from "@/lib/command";
import { fuzzy } from "@/lib/fuzzy";
import { CommandBar } from "@/components/CommandBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FileRow } from "@/components/FileRow";
import { EmptyState } from "@/components/EmptyState";

export default function App() {
  const [home, setHome] = useState<string | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => { fs.home().then(setHome).catch((e) => setError(String(e))); }, []);

  const navigate = useCallback(async (path: string) => {
    setLoading(true); setError(null); setSelected(null);
    try { setListing(await fs.list(path)); setInput(""); }
    catch (e) { setError(String(e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (home && !listing) void navigate(home); }, [home, listing, navigate]);

  const filtered = useMemo(() => {
    if (!listing) return [];
    const parsed = parseCommand(input, home);
    if (parsed.kind !== "filter") return listing.entries;
    const q = parsed.query;
    const scored: { e: Entry; s: number }[] = [];
    for (const e of listing.entries) {
      const s = fuzzy(q, e.name);
      if (s !== null) scored.push({ e, s });
    }
    scored.sort((a, b) => b.s - a.s);
    return scored.map((x) => x.e);
  }, [listing, input, home]);

  const onSubmit = (value: string) => {
    const parsed = parseCommand(value, home);
    if (parsed.kind === "navigate") void navigate(parsed.path);
    else if (parsed.kind === "filter" && filtered.length > 0) {
      const top = filtered[0];
      if (top.is_dir) void navigate(top.path); else void fs.open(top.path);
    }
  };

  const openEntry = (e: Entry) => { if (e.is_dir) void navigate(e.path); else void fs.open(e.path); };

  return (
    <div className="flex h-full flex-col" style={{ background: "var(--bg)" }}>
      <div data-tauri-drag-region style={{ height: 28, background: "var(--surface)" }} />
      <CommandBar value={input} onChange={setInput} onSubmit={onSubmit} onEscape={() => setInput("")} />
      {listing && <Breadcrumb path={listing.path} onNavigate={navigate} />}
      <div className="min-h-0 flex-1 overflow-auto">
        {error && <div className="px-4 py-8 text-center" style={{ color: "var(--danger)", fontSize: "var(--text-sm)" }}>{error}</div>}
        {!error && loading && !listing && <div className="px-4 py-8 text-center" style={{ color: "var(--text-3)", fontSize: "var(--text-sm)" }}>Loading…</div>}
        {!error && listing && filtered.length === 0 && (
          <EmptyState title={input ? `No matches for "${input}"` : "This folder is empty"}
            hint={input ? "Press esc to clear the filter." : undefined} />
        )}
        {!error && listing && filtered.length > 0 && (
          <div className="py-1">
            {filtered.map((e) => (
              <FileRow key={e.path} entry={e} selected={selected === e.path}
                onClick={() => setSelected(e.path)}
                onDoubleClick={() => openEntry(e)}
                onContextMenu={(ev) => { ev.preventDefault(); setSelected(e.path); }} />
            ))}
          </div>
        )}
      </div>
      <KeyboardShortcuts onEscape={() => { setSelected(null); setInput(""); }} />
    </div>
  );
}

function KeyboardShortcuts({ onEscape }: { onEscape: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onEscape(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEscape]);
  return null;
}
