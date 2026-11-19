import type { SpeciesAxisModel } from '../../helpers/speciesTree';

// One row of the bracket tree, including the taxon name drawn above the line.
const BRACKET_ROW = 20;
const LABEL_ABOVE_LINE = 13;
const TAXON_FONT_SIZE = 12;
// Open Sans at 12px. Matches the 8.5px estimate used for 15px axis labels.
const TAXON_CHAR_WIDTH = 6.8;
const LABEL_GAP = 4;
// Species names read upward. The first letter of every name shares one baseline
// just above the matrix. A leaf stem continues down to the top of its own name.
const LEAF_ROTATION = -90;
const LEAF_FONT_SIZE = 15;
const LEAF_TEXT_ANCHOR = 'start';
const LEAF_STEM_GAP = 4;
// The species bracket sits in the band between that baseline and the cells.
const SPECIES_BRACKET_GAP = 6;
const SPECIES_BRACKET_TICK = 5;
const SPECIES_BRACKET_CLEARANCE = 4;
const SPECIES_BRACKET_INSET = 3;

export const SPECIES_COLUMN_HIGHLIGHT = '#e7a0b0';
export const SPECIES_TAXON_SELECTED = '#9d3450';

type ColumnScale = {
  (value: string): number | undefined;
  bandwidth: () => number;
  step: () => number;
};

type LabelMetrics = { fontSize: number; charWidth: number };

export type SpeciesAxisSpeciesBracket = {
  x1: number;
  x2: number;
  y: number;
  tick: number;
};

export type SpeciesAxisLeafMark = {
  key: string;
  label: string;
  x: number;
  y: number;
  rotation: number;
  fontSize: number;
  textAnchor: 'start';
  start: number;
  end: number;
  speciesBracket: SpeciesAxisSpeciesBracket | null;
};

export type SpeciesAxisBracketMark = {
  key: string;
  label: string;
  y: number;
  xs: number[];
  childYs: number[];
  childLeafKeys: Array<string | null>;
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

// The selected clade plus every bracket and species inside its column span.
// A species selection highlights that species alone.
export const highlightedTaxonKeys = (layout: SpeciesAxisLayout, selectedKey: string | null): Set<string> => {
  const highlighted = new Set<string>();
  if (!selectedKey) return highlighted;
  const selected = layout.brackets.find((bracket) => bracket.key === selectedKey);
  if (!selected) {
    highlighted.add(selectedKey);
    return highlighted;
  }
  const inside = (start: number, end: number) => start >= selected.start && end <= selected.end;
  layout.brackets.forEach((bracket) => {
    if (inside(bracket.start, bracket.end)) highlighted.add(bracket.key);
  });
  layout.leaves.forEach((leaf) => {
    if (inside(leaf.start, leaf.end)) highlighted.add(leaf.key);
  });
  return highlighted;
};

type LayoutHelpers = {
  verticalExtent: (text: string, rotation: number, metrics: LabelMetrics) => number;
  rightExtent: (text: string, rotation: number, textAnchor: string, metrics: LabelMetrics) => number;
  labelMetrics: (fontSize: number) => LabelMetrics;
};

const columnLeft = (xScale: ColumnScale, domain: string[], index: number): number | null => {
  const value = domain[index];
  if (value == null) return null;
  const x = xScale(value);
  if (x == null || Number.isNaN(x)) return null;
  return x;
};

const columnCenter = (xScale: ColumnScale, domain: string[], index: number): number | null => {
  const left = columnLeft(xScale, domain, index);
  if (left == null) return null;
  return left + xScale.bandwidth() / 2;
};

const spanCenter = (xScale: ColumnScale, domain: string[], start: number, end: number): number | null => {
  const left = columnCenter(xScale, domain, start);
  const right = columnCenter(xScale, domain, end);
  if (left == null || right == null) return null;
  return (left + right) / 2;
};

const spanKey = (start: number, end: number) => `${start}:${end}`;

const leafKeyOf = (speciesId: string) => `species-leaf-${speciesId}`;

export const buildSpeciesAxisLayout = ({
  model,
  domain,
  xScale,
  plotRight,
  leafPadding,
  helpers,
  leafExtents,
}: {
  model: SpeciesAxisModel;
  domain: string[];
  xScale: ColumnScale;
  plotRight: number;
  leafPadding: number;
  helpers: LayoutHelpers;
  // Painted height of a name, keyed by species-leaf id. Used once the glyphs exist,
  // because a character-width estimate runs the stem into wide letters.
  leafExtents?: Record<string, { fontSize: number; label: string; extent: number }>;
}): SpeciesAxisLayout | null => {
  if (model.leaves.length === 0) return null;
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
  const extents = model.leaves.map((leaf) => {
    const measured = leafExtents?.[leafKeyOf(leaf.speciesId)];
    if (
      measured &&
      measured.label === leaf.label &&
      Math.abs(measured.fontSize - fontSize) < 0.1 &&
      measured.extent > 0
    ) {
      return measured.extent;
    }
    return helpers.verticalExtent(leaf.label, LEAF_ROTATION, metrics);
  });
  // First letters share this line. The bracket band below it stays above the cells.
  const bracketBand = SPECIES_BRACKET_GAP + SPECIES_BRACKET_TICK + SPECIES_BRACKET_CLEARANCE;
  const baselineY = -Math.max(leafPadding, bracketBand);
  const stemEnds = extents.map((extent) => baselineY - extent - LEAF_STEM_GAP);
  const highestStemEnd = Math.min(...stemEnds);
  const cladeY = (depth: number) => highestStemEnd - depth * BRACKET_ROW;
  const speciesBracketY = baselineY + SPECIES_BRACKET_GAP;
  const speciesBracketTick = Math.max(0, Math.min(SPECIES_BRACKET_TICK, -speciesBracketY - SPECIES_BRACKET_CLEARANCE));
  const stemEndBySpan = new Map<string, number>();
  const leafKeyBySpan = new Map<string, string>();
  model.leaves.forEach((leaf, index) => {
    const key = spanKey(leaf.start, leaf.end);
    stemEndBySpan.set(key, stemEnds[index]);
    leafKeyBySpan.set(key, leafKeyOf(leaf.speciesId));
  });
  const childJoinY = (child: { start: number; end: number; depth: number }) => {
    if (child.depth > 0) return cladeY(child.depth);
    return stemEndBySpan.get(spanKey(child.start, child.end)) ?? highestStemEnd;
  };

  const bandwidth = xScale.bandwidth();
  const inset = Math.min(SPECIES_BRACKET_INSET, Math.max(0.5, bandwidth * 0.15));
  const speciesBracketFor = (start: number, end: number): SpeciesAxisSpeciesBracket | null => {
    if (end <= start) return null;
    const left = columnLeft(xScale, domain, start);
    const rightEdge = columnLeft(xScale, domain, end);
    if (left == null || rightEdge == null) return null;
    const x1 = left + inset;
    const x2 = rightEdge + bandwidth - inset;
    if (x2 - x1 < 4) return null;
    return { x1, x2, y: speciesBracketY, tick: speciesBracketTick };
  };

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
      y: cladeY(bracket.depth),
      childYs: bracket.children.map((child) => childJoinY(child)),
      childLeafKeys: bracket.children.map((child) =>
        child.depth > 0 ? null : (leafKeyBySpan.get(spanKey(child.start, child.end)) ?? null)
      ),
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
    topSpace: -cladeY(model.depth) + LABEL_ABOVE_LINE + 6,
    rightOverflow: Math.max(0, rightOverflow),
    leaves: model.leaves.map((leaf, index) => ({
      key: leafKeyOf(leaf.speciesId),
      label: leaf.label,
      x: leafCenters[index],
      y: baselineY,
      rotation: LEAF_ROTATION,
      fontSize,
      textAnchor: LEAF_TEXT_ANCHOR,
      start: leaf.start,
      end: leaf.end,
      speciesBracket: speciesBracketFor(leaf.start, leaf.end),
    })),
    brackets: brackets.map((bracket) => ({
      key: bracket.key,
      label: bracket.label,
      y: bracket.y,
      xs: bracket.xs,
      childYs: bracket.childYs,
      childLeafKeys: bracket.childLeafKeys,
      showLabel: shown.has(bracket.key),
      labelX: labelXByKey.get(bracket.key) ?? bracket.cx,
      start: bracket.start,
      end: bracket.end,
    })),
  };
};

export const TAXON_LABEL_FONT_SIZE = TAXON_FONT_SIZE;
