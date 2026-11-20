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

// 'self': this cell's own score is the parent's best descendant score.
// 'branch': this cell's own score is not, and its best descendant score is.
// A sibling can be 'self' while another sibling is 'branch' for the same score.
export type ParentDescendantMark = 'self' | 'branch';

export const PARENT_DESCENDANT_MARK_LABEL: Record<ParentDescendantMark, string> = {
  self: 'best descendant of the parent',
  branch: "branch of the parent's best descendant",
};

export const roundedExpressionScore = (value: unknown): number | undefined => {
  const numeric =
    typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : Number.NaN;
  if (!Number.isFinite(numeric)) return undefined;
  return formatExpressionScore(numeric);
};

export const descendantCellMarkKey = (geneId: unknown, termId: unknown): string => `${geneId}\u0000${termId}`;

// Side length of the corner triangle. Zero means the box cannot hold one.
// The cap matches the mark drawn on a full-size cell; the fraction keeps a
// readable triangle as columns shrink toward the minimum cell width.
export const cornerMarkSize = (width: number, height: number): number => {
  if (!(width > 0) || !(height > 0)) return 0;
  const size = Math.min(8, width * 0.45, height * 0.45);
  return size >= 4 ? size : 0;
};

type MarkBox = { x: number; y: number; width: number; height: number };

// Prefer the inner fill so the triangle sits on the expression color.
// A narrow column's fill is smaller than the frame pad, so the mark then
// uses the whole tile and stays visible.
export const descendantMarkBox = (outer: MarkBox, framePad: number): MarkBox => {
  if (!(framePad > 0)) return outer;
  const inner = {
    x: outer.x + framePad,
    y: outer.y + framePad,
    width: outer.width - framePad * 2,
    height: outer.height - framePad * 2,
  };
  return cornerMarkSize(inner.width, inner.height) > 0 ? inner : outer;
};

// Direct children of one expanded parent, for one gene.
// Each child is judged on its own: 'self' when its score matches the parent best,
// otherwise 'branch' when its best descendant does. A tie marks every match.
export const descendantChildMarks = (
  parentBest: unknown,
  children: Array<{ id: string; ownScore?: unknown; descendantScore?: unknown }>
): Map<string, ParentDescendantMark> => {
  const marks = new Map<string, ParentDescendantMark>();
  const target = roundedExpressionScore(parentBest);
  if (target == null || !children?.length) return marks;
  children.forEach((child) => {
    if (!child.id) return;
    if (roundedExpressionScore(child.ownScore) === target) {
      marks.set(child.id, 'self');
    } else if (roundedExpressionScore(child.descendantScore) === target) {
      marks.set(child.id, 'branch');
    }
  });
  return marks;
};

type MarkedCell = { x?: unknown; y?: unknown; value?: unknown; maxExp?: unknown };
type MarkedNode = { id?: unknown; isExpanded?: boolean; children?: MarkedNode[] };

// Marks for every expanded parent in the tree. A collapsed parent contributes none,
// because the mark describes a child that is on screen.
export const bestDescendantCellMarks = (
  tree: MarkedNode[] | undefined,
  cells: MarkedCell[] | undefined
): Map<string, ParentDescendantMark> => {
  const byGene = new Map<unknown, Map<unknown, { own: number | undefined; descendant: number | undefined }>>();
  (cells || []).forEach((cell) => {
    if (cell?.x == null || cell?.y == null) return;
    let byTerm = byGene.get(cell.x);
    if (!byTerm) {
      byTerm = new Map();
      byGene.set(cell.x, byTerm);
    }
    byTerm.set(cell.y, {
      own: roundedExpressionScore(cell.value),
      descendant: roundedExpressionScore(cell.maxExp),
    });
  });

  const marks = new Map<string, ParentDescendantMark>();
  const walk = (nodes: MarkedNode[] | undefined) => {
    if (!Array.isArray(nodes)) return;
    nodes.forEach((node) => {
      const children = node.children;
      if (node.isExpanded && node.id != null && children?.length) {
        byGene.forEach((byTerm, geneId) => {
          const parent = byTerm.get(node.id);
          if (parent?.descendant == null) return;
          const childScores: Array<{ id: string; ownScore?: unknown; descendantScore?: unknown }> = [];
          children.forEach((child) => {
            if (child?.id == null) return;
            const scores = byTerm.get(child.id);
            if (!scores) return;
            childScores.push({
              id: String(child.id),
              ownScore: scores.own,
              descendantScore: scores.descendant,
            });
          });
          descendantChildMarks(parent.descendant, childScores).forEach((kind, childId) => {
            marks.set(descendantCellMarkKey(geneId, childId), kind);
          });
        });
      }
      walk(children);
    });
  };
  walk(tree);
  return marks;
};
