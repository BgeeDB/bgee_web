/** Numeric score only; skips null/undefined/NaN/non-numeric (avoids string + number concat in reduce). */
export function toNumericScore(v) {
  if (v === null || v === undefined) return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Per term (row id), aggregate scores across all heatmap cells for that term. */
export function computeTermAggregates(rows, aggFn) {
  const byTerm = new Map();
  (rows || []).forEach((d) => {
    const n = toNumericScore(d.value);
    if (n === null) return;
    if (!byTerm.has(d.y)) byTerm.set(d.y, []);
    byTerm.get(d.y).push(n);
  });
  const scores = new Map();
  byTerm.forEach((values, termId) => {
    if (aggFn === 'max') {
      scores.set(termId, Math.max(...values));
    } else {
      scores.set(termId, values.reduce((a, b) => a + b, 0) / values.length);
    }
  });
  return scores;
}

/** Pick highest-scoring direct child (prefer isTopLevelTerm pool) under one tree root. */
export function pickWinnerChildIdForRoot(root, scoreByTermId) {
  if (!root?.children?.length) return null;
  const pool = root.children.filter((c) => c.isTopLevelTerm);
  const candidates = pool.length ? pool : [...root.children];

  const withScores = candidates.map((c) => ({
    id: c.id,
    label: c.label,
    score: scoreByTermId.has(c.id) ? scoreByTermId.get(c.id) : -Infinity,
  }));

  const ranked = withScores
    .filter((x) => x.score > -Infinity)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.label.localeCompare(b.label);
    });

  if (!ranked.length) return null;
  return ranked[0].id;
}
