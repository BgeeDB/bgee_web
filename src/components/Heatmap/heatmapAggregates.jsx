/** Numeric score only; skips null/undefined/NaN/non-numeric. */
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
