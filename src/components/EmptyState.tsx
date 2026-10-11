import { Folder } from "@phosphor-icons/react";
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="grid place-items-center py-20">
      <Folder size={36} weight="thin" style={{ color: "var(--text-4)" }} />
      <div className="mt-3" style={{ fontSize: "var(--text-base)", color: "var(--text-2)" }}>{title}</div>
      {hint && <div className="mt-1" style={{ fontSize: "var(--text-sm)", color: "var(--text-3)" }}>{hint}</div>}
    </div>
  );
}
