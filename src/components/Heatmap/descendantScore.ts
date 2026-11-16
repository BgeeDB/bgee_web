// A score is a finite number, or an object shaped like { expressionScore: number }.
export const descendantExpressionScore = (value: unknown): number | undefined => {
  const raw =
    typeof value === 'number'
      ? value
      : value !== null && typeof value === 'object' && 'expressionScore' in value
        ? (value as { expressionScore?: unknown }).expressionScore
        : undefined;
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : undefined;
};

// The live field is expressionScore.bestDescendantExpressionScore. A top-level
// bestDescendantExpressionScore is used when the API sends one that is not null.
export const callDescendantExpressionScore = (
  call:
    | {
        bestDescendantExpressionScore?: unknown;
        expressionScore?: {
          expressionScore?: unknown;
          bestDescendantExpressionScore?: unknown;
        } | null;
      }
    | null
    | undefined
): number | undefined => {
  if (!call) return undefined;
  const topLevel = descendantExpressionScore(call.bestDescendantExpressionScore);
  if (topLevel != null) return topLevel;
  const nested = call.expressionScore?.bestDescendantExpressionScore;
  return descendantExpressionScore(nested);
};

export const formatExpressionScore = (value: number): number => Math.round(value * 100) / 100;
