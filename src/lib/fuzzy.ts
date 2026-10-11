export function fuzzy(query: string, target: string): number | null {
  if (!query) return 0;
  const q = query.toLowerCase(); const t = target.toLowerCase();
  let qi = 0, score = 0, streak = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) { streak++; score += 1 + streak * 0.4; if (ti === 0) score += 3; qi++; }
    else streak = 0;
  }
  if (qi < q.length) return null;
  return score - target.length * 0.02;
}
