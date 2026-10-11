export type Parsed = { kind: "navigate"; path: string } | { kind: "filter"; query: string } | { kind: "empty" };
const NAV_VERBS = new Set(["open", "cd", "go", "goto"]);
export function parseCommand(input: string, home: string | null): Parsed {
  const raw = input.trim();
  if (!raw) return { kind: "empty" };
  const looksLikePath = raw.startsWith("/") || raw.startsWith("~") || raw.startsWith("./") || raw.startsWith("../") || raw.includes("/");
  if (looksLikePath) return { kind: "navigate", path: expandPath(raw, home) };
  const [head, ...rest] = raw.split(/\s+/);
  if (NAV_VERBS.has(head.toLowerCase()) && rest.length > 0) return { kind: "navigate", path: expandPath(rest.join(" "), home) };
  return { kind: "filter", query: raw };
}
export function expandPath(input: string, home: string | null): string {
  let p = input.trim();
  if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) p = p.slice(1, -1);
  if (p === "~" && home) return home;
  if (p.startsWith("~/") && home) return home + p.slice(1);
  return p;
}
