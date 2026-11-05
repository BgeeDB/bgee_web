import type { SpeciesAxisModel } from '../../helpers/speciesTree';

// One row of the bracket tree, including the taxon name drawn above the line.
const BRACKET_ROW = 20;
const LABEL_ABOVE_LINE = 13;
const TAXON_FONT_SIZE = 12;
// Open Sans at 12px. Matches the 8.5px estimate used for 15px axis labels.
const TAXON_CHAR_WIDTH = 6.8;
const LABEL_GAP = 4;
// Species names hang down from the leaf stem, reading upward along that stem.
const LEAF_ROTATION = -90;
const LEAF_FONT_SIZE = 15;
const LEAF_TEXT_ANCHOR = 'end';
const LEAF_STEM_GAP = 4;

export const SPECIES_COLUMN_HIGHLIGHT = '#e7a0b0';
export const SPECIES_TAXON_SELECTED = '#9d3450';

type ColumnScale = {
  (value: string): number | undefined;
  bandwidth: () => number;
  step: () => number;
};

type LabelMetrics = { fontSize: number; charWidth: number };

export type SpeciesAxisLeafMark = {
  key: string;
  label: string;
  x: number;
  y: number;
  rotation: number;
  fontSize: number;
  textAnchor: 'end';
  start: number;
  end: number;
};

export type SpeciesAxisBracketMark = {
  key: string;
  label: string;
  y: number;
  xs: number[];
  childYs: number[];
  showLabel: boolean;
  labelX: number;
  start: number;
  end: number;
};

export type SpeciesAxisLayout = {
  topSpace: number;
  rightOverflow: number;
  leaves: SpeciesAxisLeafMark[];
  brackets: SpeciesAxisBracketMark[];
};

type LayoutHelpers = {
  verticalExtent: (text: string, rotation: number, metrics: LabelMetrics) => number;
  rightExtent: (text: string, rotation: number, textAnchor: string, metrics: LabelMetrics) => number;
  labelMetrics: (fontSize: number) => LabelMetrics;
};

const columnCenter = (xScale: ColumnScale, domain: string[], index: number): number | null => {
  const value = domain[index];
  if (value == null) return null;
  const x = xScale(value);
  if (x == null || Number.isNaN(x)) return null;
  return x + xScale.bandwidth() / 2;
};

const spanCenter = (xScale: ColumnScale, domain: string[], start: number, end: number): number | null => {
  const left = columnCenter(xScale, domain, start);
  const right = columnCenter(xScale, domain, end);
  if (left == null || right == null) return null;
  return (left + right) / 2;
};

export const buildSpeciesAxisLayout = ({
  model,
  domain,
  xScale,
  plotRight,
  leafPadding,
  helpers,
}: {
  model: SpeciesAxisModel;
  domain: string[];
  xScale: ColumnScale;
  plotRight: number;
  leafPadding: number;
  helpers: LayoutHelpers;
}): SpeciesAxisLayout | null => {
  const centers = model.leaves.map((leaf) => spanCenter(xScale, domain, leaf.start, leaf.end));
  if (centers.some((center) => center == null)) return null;
  const leafCenters = centers as number[];

  let minPitch = xScale.step();
  for (let index = 1; index < leafCenters.length; index += 1) {
    minPitch = Math.min(minPitch, leafCenters[index] - leafCenters[index - 1]);
  }
  // A vertical name is only as wide as its em box, so the column pitch limits the font, not the word length.
  const fontSize = minPitch > LEAF_FONT_SIZE + 2 ? LEAF_FONT_SIZE : Math.max(9, minPitch - 2);
  const metrics = helpers.labelMetrics(fontSize);
  const leafExtent = model.leaves.reduce(
    (max, leaf) => Math.max(max, helpers.verticalExtent(leaf.label, LEAF_ROTATION, metrics)),
    0
  );
  const leafSpace = leafExtent + leafPadding;
  // Tops of the names share one line, a few pixels under the leaf stems. Each name hangs down from there.
  const leafJoinY = -leafSpace;
  const leafAnchorY = leafJoinY + LEAF_STEM_GAP;
  const bracketY = (depth: number) => leafJoinY - depth * BRACKET_ROW;
  const childJoinY = (depth: number) => (depth <= 0 ? leafJoinY : bracketY(depth));

  const placed = model.brackets.map((bracket) => {
    const xs = bracket.children.map((child) => spanCenter(xScale, domain, child.start, child.end));
    if (xs.some((x) => x == null) || xs.length === 0) return null;
    const childXs = xs as number[];
    const width = bracket.label.length * TAXON_CHAR_WIDTH;
    const xLeft = childXs[0];
    const xRight = childXs[childXs.length - 1];
    return {
      ...bracket,
      xs: childXs,
      y: bracketY(bracket.depth),
      childYs: bracket.children.map((child) => childJoinY(child.depth)),
      width,
      cx: (xLeft + xRight) / 2,
      span: Math.max(0, xRight - xLeft),
    };
  });
  if (placed.some((bracket) => bracket == null)) return null;
  const brackets = placed as Array<NonNullable<(typeof placed)[number]>>;

  const shown = new Set<string>();
  const labelXByKey = new Map<string, number>();
  const byDepth = new Map<number, typeof brackets>();
  brackets.forEach((bracket) => {
    const list = byDepth.get(bracket.depth) || [];
    list.push(bracket);
    byDepth.set(bracket.depth, list);
  });
  byDepth.forEach((list) => {
    const kept: Array<{ left: number; right: number }> = [];
    [...list]
      .sort((left, right) => right.span - left.span)
      .forEach((bracket) => {
        const half = bracket.width / 2;
        let labelX = bracket.cx;
        if (labelX - half < 2) labelX = half + 2;
        const leftEdge = labelX - half;
        const rightEdge = labelX + half;
        const collides = kept.some((other) => leftEdge < other.right + LABEL_GAP && rightEdge > other.left - LABEL_GAP);
        if (collides) return;
        kept.push({ left: leftEdge, right: rightEdge });
        shown.add(bracket.key);
        labelXByKey.set(bracket.key, labelX);
      });
  });

  let rightOverflow = 0;
  model.leaves.forEach((leaf, index) => {
    const x = leafCenters[index];
    const extent = helpers.rightExtent(leaf.label, LEAF_ROTATION, LEAF_TEXT_ANCHOR, metrics);
    rightOverflow = Math.max(rightOverflow, x + extent - plotRight);
  });
  brackets.forEach((bracket) => {
    if (!shown.has(bracket.key)) return;
    const labelX = labelXByKey.get(bracket.key) ?? bracket.cx;
    rightOverflow = Math.max(rightOverflow, labelX + bracket.width / 2 - plotRight);
  });

  return {
    topSpace: leafSpace + model.depth * BRACKET_ROW + LABEL_ABOVE_LINE + 6,
    rightOverflow: Math.max(0, rightOverflow),
    leaves: model.leaves.map((leaf, index) => ({
      key: `species-leaf-${leaf.speciesId}`,
      label: leaf.label,
      x: leafCenters[index],
      y: leafAnchorY,
      rotation: LEAF_ROTATION,
      fontSize,
      textAnchor: LEAF_TEXT_ANCHOR,
      start: leaf.start,
      end: leaf.end,
    })),
    brackets: brackets.map((bracket) => ({
      key: bracket.key,
      label: bracket.label,
      y: bracket.y,
      xs: bracket.xs,
      childYs: bracket.childYs,
      showLabel: shown.has(bracket.key),
      labelX: labelXByKey.get(bracket.key) ?? bracket.cx,
      start: bracket.start,
      end: bracket.end,
    })),
  };
};

const toggleTaxon = (
  event: { key: string; preventDefault: () => void },
  key: string,
  onToggle: (key: string) => void
) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  onToggle(key);
};

export const SpeciesAxisMarks = ({
  layout,
  selectedKey,
  onToggle,
}: {
  layout: SpeciesAxisLayout;
  selectedKey: string | null;
  onToggle: (key: string) => void;
}) => (
  <g data-testid="species-axis-tree">
    {layout.brackets.map((bracket) => {
      const x1 = bracket.xs[0];
      const x2 = bracket.xs[bracket.xs.length - 1];
      const selected = bracket.key === selectedKey;
      const stroke = selected ? SPECIES_TAXON_SELECTED : '#444';
      return (
        <g
          key={bracket.key}
          data-testid={`species-taxon-${bracket.key}`}
          role="button"
          tabIndex={0}
          aria-pressed={selected}
          aria-label={bracket.label}
          style={{ cursor: 'pointer' }}
          onClick={() => onToggle(bracket.key)}
          onKeyDown={(event) => toggleTaxon(event, bracket.key, onToggle)}
        >
          <line x1={x1} y1={bracket.y} x2={x2} y2={bracket.y} stroke="transparent" strokeWidth={12}>
            <title>{bracket.label}</title>
          </line>
          <line x1={x1} y1={bracket.y} x2={x2} y2={bracket.y} stroke={stroke} strokeWidth={selected ? 2 : 1} />
          {bracket.xs.map((x, index) => (
            <line
              key={`${bracket.key}-stem-${index}`}
              x1={x}
              y1={bracket.y}
              x2={x}
              y2={bracket.childYs[index]}
              stroke={stroke}
              strokeWidth={selected ? 2 : 1}
            />
          ))}
          {bracket.showLabel ? (
            <text
              x={bracket.labelX}
              y={bracket.y - 4}
              textAnchor="middle"
              fontSize={TAXON_FONT_SIZE}
              fontFamily="Open Sans, sans-serif"
              fontWeight={selected ? 700 : 400}
              fill={selected ? SPECIES_TAXON_SELECTED : '#222'}
            >
              {bracket.label}
              <title>{bracket.label}</title>
            </text>
          ) : null}
        </g>
      );
    })}
    {layout.leaves.map((leaf) => {
      const selected = leaf.key === selectedKey;
      return (
        <text
          key={leaf.key}
          data-testid={`species-taxon-${leaf.key}`}
          role="button"
          tabIndex={0}
          aria-pressed={selected}
          aria-label={leaf.label}
          style={{ cursor: 'pointer' }}
          transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rotation})`}
          textAnchor={leaf.textAnchor}
          dominantBaseline="middle"
          fontSize={leaf.fontSize}
          fontFamily="Open Sans, sans-serif"
          fontWeight={selected ? 700 : 400}
          fill={selected ? SPECIES_TAXON_SELECTED : '#222'}
          onClick={() => onToggle(leaf.key)}
          onKeyDown={(event) => toggleTaxon(event, leaf.key, onToggle)}
        >
          {leaf.label}
          <title>{leaf.label}</title>
        </text>
      );
    })}
  </g>
);
