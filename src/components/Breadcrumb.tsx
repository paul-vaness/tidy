import { CaretRight } from "@phosphor-icons/react";
export function Breadcrumb({ path, onNavigate }: { path: string; onNavigate: (p: string) => void }) {
  if (!path) return null;
  const parts = path.split("/").filter(Boolean);
  const segs = parts.map((label, i) => ({ label, path: "/" + parts.slice(0, i + 1).join("/") }));
  return (
    <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto" style={{ background: "var(--bg)" }}>
      <button className="rounded px-1.5 py-0.5" style={{ fontSize: "var(--text-sm)", color: "var(--text-3)" }}
        onClick={() => onNavigate("/")}>/</button>
      {segs.map((s, i) => (
        <div key={s.path} className="flex items-center gap-1">
          <CaretRight size={10} style={{ color: "var(--text-4)" }} />
          <button className="rounded px-1.5 py-0.5 whitespace-nowrap"
            style={{ fontSize: "var(--text-sm)",
                     color: i === segs.length - 1 ? "var(--text)" : "var(--text-2)",
                     fontWeight: i === segs.length - 1 ? 500 : 400 }}
            onClick={() => onNavigate(s.path)}>{s.label}</button>
        </div>
      ))}
    </div>
  );
}
