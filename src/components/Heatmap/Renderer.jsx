import { useEffect, useLayoutEffect, useMemo, useRef, useState, forwardRef } from 'react';
import * as d3 from 'd3';
import { Tree } from './TreeSvg';
import { ColorLegendSvg } from './ColorLegendSvg';
// import { Tooltip } from "../../../Tooltip";
// import styles from "./renderer.module.css";
import fonts from './fonts';
import { computeTermAggregates } from './heatmapAggregates';
import { hideLooseSingleCellRows } from './singleCellRows';
import { isOthersBucket } from '../../helpers/othersAnatomicalBucket';

// A row with its own calls keeps that score. A header with none (a single-cell-only
// organ) takes the same mean or max already used across genes.
function expressionScoreForSort(node, scoreMap, aggFn) {
  if (scoreMap.has(node.id)) return scoreMap.get(node.id);
  const childScores = [];
  (node.children || []).forEach((child) => {
    const score = expressionScoreForSort(child, scoreMap, aggFn);
    if (Number.isFinite(score)) childScores.push(score);
  });
  if (childScores.length === 0) return -Infinity;
  if (aggFn === 'max') return Math.max(...childScores);
  return childScores.reduce((sum, score) => sum + score, 0) / childScores.length;
}

function sortBlock(nodes, cmp) {
  return [...nodes].sort(cmp);
}

// Expanded rows that group cell types under an organ keep those cell types in one
// block, after the anatomical siblings, under either ordering.
function keepsCellTypesTogether(nodes) {
  return nodes.some(
    (node) =>
      node.groupedUnderAnatEntity ||
      node.isSyntheticSingleCellGroup ||
      (node.children || []).some((child) => child.groupedUnderAnatEntity)
  );
}

function sortSiblingTerms(children, rowOrdering, scoreMap, aggFn) {
  if (!children?.length) return children;
  // The synthetic "others" bucket has no expression score and stays last in every ordering.
  const pinnedBottom = children.filter((c) => isOthersBucket(c));
  const sortable = children.filter((c) => !isOthersBucket(c));
  const low = sortable.filter((c) => !c.isTopLevelTerm);
  const high = sortable.filter((c) => c.isTopLevelTerm);
  const cmpAlpha = (a, b) => a.label.localeCompare(b.label);
  const cmpExpr = (a, b) => {
    const sa = expressionScoreForSort(a, scoreMap, aggFn);
    const sb = expressionScoreForSort(b, scoreMap, aggFn);
    if (sb !== sa) return sb - sa;
    return a.label.localeCompare(b.label);
  };
  const cmp = rowOrdering === 'expression' ? cmpExpr : cmpAlpha;
  const orderedLow = keepsCellTypesTogether(low)
    ? [
        ...sortBlock(
          low.filter((c) => !c.isSingleCell),
          cmp
        ),
        ...sortBlock(
          low.filter((c) => c.isSingleCell),
          cmp
        ),
      ]
    : sortBlock(low, cmp);
  return [...orderedLow, ...sortBlock(high, cmp), ...pinnedBottom];
}

function reorderAnatomyTree(nodes, rowOrdering, scoreMap, aggFn) {
  if (!nodes?.length) return nodes;
  const withSubtrees = nodes.map((node) => ({
    ...node,
    children: node.children?.length ? reorderAnatomyTree(node.children, rowOrdering, scoreMap, aggFn) : node.children,
  }));
  return sortSiblingTerms(withSubtrees, rowOrdering, scoreMap, aggFn);
}

const DEFAULT_MARGIN = { top: 50, right: 10, bottom: 50, left: 200 };

// X-axis label geometry constants (must match the <text> elements below)
const X_LABEL_FONT_SIZE = 15;
const X_LABEL_LINE_HEIGHT = 1.2;
// Empirical average glyph width at X_LABEL_FONT_SIZE for sans-serif (Open Sans).
// Slight over-estimate is safer. Scaled with the font when columns shrink.
const X_LABEL_CHAR_WIDTH = 8.5;
// Extra breathing room added on top of the projected label extent.
const X_LABEL_PADDING = 15;
// Bottom labels are anchored this far below the cells (see xLabelsBottom).
const X_LABEL_ANCHOR_OFFSET = 10;
// Minimum gap between the bottom of the heatmap cells and the color legend.
const DEFAULT_BOTTOM_LABEL_GAP = 40;
// ColorLegendSvg draws its title and help badge above posY (badge top is at posY - 23).
const COLOR_LEGEND_OVERFLOW_TOP = 25;
// Baseline of the "Not expressed" / "No data" row in ColorLegendSvg (posY + 48).
const COLOR_LEGEND_SWATCH_BASELINE = 48;
// Pixels of air between neighboring label em-boxes once the font has to shrink.
const X_LABEL_NEIGHBOR_GAP = 1;

const labelMetrics = (fontSize) => {
  const size = Number.isFinite(fontSize) && fontSize > 0 ? fontSize : X_LABEL_FONT_SIZE;
  return {
    fontSize: size,
    charWidth: (X_LABEL_CHAR_WIDTH * size) / X_LABEL_FONT_SIZE,
  };
};

// Em-box height of a label, in units of fontSize. Multi-line labels are thicker.
const labelBlockEm = (text) => {
  const lines = String(text ?? '').split('\n');
  if (lines.length <= 1) return 1;
  return (lines.length - 1) * X_LABEL_LINE_HEIGHT + 1;
};

const axisLabelTexts = (xTerms) => {
  if (!xTerms?.length) return [];
  return xTerms.flatMap((term) => [
    term?.topLabel ?? term?.label ?? term?.value ?? '',
    term?.bottomLabel ?? term?.label ?? term?.value ?? '',
  ]);
};

const normalizeDeg = (deg) => {
  const wrapped = Number(deg) % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
};

// Upright angle in the same half-turn, so up-right text stays upward and
// down-right text stays downward as the slant steepens.
const verticalForRotation = (rotation) => (normalizeDeg(rotation) < 180 ? 90 : 270);

const labelBlockEmForTerms = (xTerms) =>
  axisLabelTexts(xTerms).reduce((max, text) => Math.max(max, labelBlockEm(text)), 1);

// Largest em size whose box fits between neighboring baselines at this slant.
// Horizontal labels share one line, so the pitch does not limit the font.
const fontSizeForPitchAndRotation = (pitch, rotation, blockEm) => {
  const sinAbs = Math.abs(Math.sin((rotation * Math.PI) / 180));
  if (sinAbs < 1e-3) return X_LABEL_FONT_SIZE;
  const separation = pitch * sinAbs;
  const gap = separation > X_LABEL_NEIGHBOR_GAP * 2 ? X_LABEL_NEIGHBOR_GAP : 0;
  return Math.min(X_LABEL_FONT_SIZE, Math.max(0, (separation - gap) / blockEm));
};

// Top and bottom x-axis label layout.
// Adjacent baselines are `pitch * |sin θ|` apart. A shallow slant makes that
// gap smaller than a 15px em box, which is why a packed gene set was drawing
// tiny type. Tip the labels toward upright, only as far as needed for the
// design size to fit. At the narrowest columns they stand vertical and the
// font is limited by the column pitch itself.
const xLabelLayoutForPitch = (pitch, preferredRotation, xTerms) => {
  const preferred = Number(preferredRotation);
  if (!(pitch > 0) || !Number.isFinite(pitch) || !Number.isFinite(preferred)) {
    return { rotation: Number.isFinite(preferred) ? preferred : 0, fontSize: X_LABEL_FONT_SIZE };
  }
  const preferredSin = Math.abs(Math.sin((preferred * Math.PI) / 180));
  if (preferredSin < 1e-3) {
    return { rotation: preferred, fontSize: X_LABEL_FONT_SIZE };
  }
  const blockEm = labelBlockEmForTerms(xTerms);
  if (fontSizeForPitchAndRotation(pitch, preferred, blockEm) >= X_LABEL_FONT_SIZE - 0.05) {
    return { rotation: preferred, fontSize: X_LABEL_FONT_SIZE };
  }
  const neededSin = Math.min(1, (X_LABEL_FONT_SIZE * blockEm + X_LABEL_NEIGHBOR_GAP) / pitch);
  const from = normalizeDeg(preferred);
  const vertical = verticalForRotation(from);
  if (neededSin >= 1 - 1e-6) {
    return { rotation: vertical, fontSize: fontSizeForPitchAndRotation(pitch, vertical, blockEm) };
  }
  let delta = vertical - from;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 16; i += 1) {
    const mid = (lo + hi) / 2;
    const sinAbs = Math.abs(Math.sin(((from + mid * delta) * Math.PI) / 180));
    if (sinAbs >= neededSin) hi = mid;
    else lo = mid;
  }
  const rotation = from + hi * delta;
  return { rotation, fontSize: fontSizeForPitchAndRotation(pitch, rotation, blockEm) };
};

// Estimate how far a bottom x-axis label hangs below its anchor when rotated.
// Bottom labels use textAnchor="end" and dominantBaseline="middle", so the
// string extends to the left of the anchor before rotation.
const estimateLabelExtentBelowAnchor = (text, rotationDeg, metrics) => {
  if (!text) return 0;
  const lines = text.split('\n');
  const rotRad = (rotationDeg * Math.PI) / 180;
  const sin = Math.sin(rotRad);
  const cos = Math.cos(rotRad);
  const maxLineLength = Math.max(...lines.map((line) => line.length));
  const textWidth = maxLineLength * metrics.charWidth;
  const lineHeight = metrics.fontSize * X_LABEL_LINE_HEIGHT;
  const yMin = -metrics.fontSize / 2;
  const yMax = (lines.length - 1) * lineHeight + metrics.fontSize / 2;
  const corners = [
    [-textWidth, yMin],
    [0, yMin],
    [-textWidth, yMax],
    [0, yMax],
  ];
  const maxY = Math.max(...corners.map(([x, y]) => x * sin + y * cos));
  return Math.max(0, maxY);
};

// Full axis-aligned height of a label. Used for the top margin, where labels
// grow upward and clipping the top of the SVG is the failure mode.
const estimateLabelVerticalExtent = (text, rotationDeg, metrics) => {
  if (!text) return 0;
  const lines = text.split('\n');
  const rotRad = (rotationDeg * Math.PI) / 180;
  const sinAbs = Math.abs(Math.sin(rotRad));
  const cosAbs = Math.abs(Math.cos(rotRad));
  const maxLineLength = Math.max(...lines.map((line) => line.length));
  const textWidth = maxLineLength * metrics.charWidth;
  const lineHeight = metrics.fontSize * X_LABEL_LINE_HEIGHT;
  const textHeight = lines.length === 1 ? metrics.fontSize : (lines.length - 1) * lineHeight + metrics.fontSize;
  return sinAbs * textWidth + cosAbs * textHeight;
};

// Local axis-aligned box of a label before rotation.
// dominantBaseline="middle"; textAnchor selects where the anchor sits on that box.
const labelLocalBox = (text, textAnchor, metrics) => {
  const lines = String(text).split('\n');
  const maxLineLength = Math.max(...lines.map((line) => line.length));
  const textWidth = maxLineLength * metrics.charWidth;
  const lineHeight = metrics.fontSize * X_LABEL_LINE_HEIGHT;
  const yMin = -metrics.fontSize / 2;
  const yMax = (lines.length - 1) * lineHeight + metrics.fontSize / 2;
  const xMin = textAnchor === 'end' ? -textWidth : textAnchor === 'middle' ? -textWidth / 2 : 0;
  const xMax = textAnchor === 'end' ? 0 : textAnchor === 'middle' ? textWidth / 2 : textWidth;
  return { xMin, xMax, yMin, yMax };
};

// How far a label extends to the right of its anchor after SVG rotate(θ).
// The SVG rotation matrix is [cos -sin; sin cos], so x' = x cos θ - y sin θ.
// Top labels use textAnchor "start" when rotated (the string runs up and to the right
// at the default 325°) and "middle" when horizontal.
const estimateLabelExtentRightOfAnchor = (text, rotationDeg, textAnchor, metrics) => {
  if (!text) return 0;
  const rotRad = (rotationDeg * Math.PI) / 180;
  const sin = Math.sin(rotRad);
  const cos = Math.cos(rotRad);
  const { xMin, xMax, yMin, yMax } = labelLocalBox(text, textAnchor, metrics);
  const corners = [
    [xMin, yMin],
    [xMax, yMin],
    [xMin, yMax],
    [xMax, yMax],
  ];
  const maxX = Math.max(...corners.map(([x, y]) => x * cos - y * sin));
  return Math.max(0, maxX);
};

// Distance by which slanted top labels pass the right edge of the cells.
// Each label is anchored at the center of its column, so a long label on an
// earlier column can stick out further than a short one on the last column.
const estimateTopLabelRightOverflow = (xTerms, xScale, rotationDeg, plotRight, metrics) => {
  const textAnchor = rotationDeg === 0 ? 'middle' : 'start';
  let maxRight = 0;
  xTerms.forEach((term) => {
    const x = xScale(term.value ?? term.label);
    if (x === undefined) return;
    const xCoord = x + xScale.bandwidth() / 2;
    const label = term.topLabel ?? term.label ?? term.value ?? '';
    maxRight = Math.max(maxRight, xCoord + estimateLabelExtentRightOfAnchor(label, rotationDeg, textAnchor, metrics));
  });
  return Math.max(0, maxRight - plotRight);
};

// Same quantity from the painted glyphs, in the label group's coordinate system
// (x = 0 at the left edge of the cells). Returns null when the glyphs cannot be
// measured yet (font not applied, jsdom, detached SVG).
const measureTopLabelRightOverflow = (labelGroup, plotRight) => {
  const svg = labelGroup.ownerSVGElement;
  if (!svg) return null;
  const groupCtm = labelGroup.getScreenCTM();
  if (!groupCtm) return null;
  let toGroup;
  try {
    toGroup = groupCtm.inverse();
  } catch {
    return null;
  }
  let maxX = 0;
  let sawGlyphs = false;
  for (const node of labelGroup.querySelectorAll('text')) {
    let box;
    try {
      box = node.getBBox();
    } catch {
      continue;
    }
    if (!(box.width > 0)) continue;
    const nodeCtm = node.getScreenCTM();
    if (!nodeCtm) continue;
    sawGlyphs = true;
    const matrix = toGroup.multiply(nodeCtm);
    const corners = [
      [box.x, box.y],
      [box.x + box.width, box.y],
      [box.x, box.y + box.height],
      [box.x + box.width, box.y + box.height],
    ];
    for (const [x, y] of corners) {
      const pt = svg.createSVGPoint();
      pt.x = x;
      pt.y = y;
      const p = pt.matrixTransform(matrix);
      if (Number.isFinite(p.x)) maxX = Math.max(maxX, p.x);
    }
  }
  if (!sawGlyphs) return null;
  return Math.max(0, maxX - plotRight);
};

// Extra pixels reserved beside each column when turning a cell size into plot width.
const COLUMN_GAP = 4;
// Keep the fitted drawing a hair inside the viewport so a scrollbar does not appear.
const FIT_SLACK = 4;

const contentWidthForCellSize = ({ cellSize, domain, xTerms, xLabelRotation, marginLeft, marginRight }) => {
  const requiredXWidth = domain.length * (cellSize + COLUMN_GAP);
  const xScale = d3.scaleBand().range([0, requiredXWidth]).domain(domain).padding(0.01);
  const layout = xLabelLayoutForPitch(xScale.step(), xLabelRotation, xTerms);
  const metrics = labelMetrics(layout.fontSize);
  const overflow = estimateTopLabelRightOverflow(xTerms, xScale, layout.rotation, requiredXWidth, metrics);
  const right = Math.max(marginRight, overflow + X_LABEL_PADDING);
  return (Number(marginLeft) || 0) + requiredXWidth + right;
};

// Preferred cell size when the drawing fits. Otherwise the largest size that fits
// in the viewport, and never smaller than the minimum.
const fitCellWidth = ({ preferred, minimum, availableWidth, ...rest }) => {
  if (!(availableWidth > 0) || !rest.domain?.length) return preferred;
  const budget = availableWidth - FIT_SLACK;
  const widthAt = (cellSize) => contentWidthForCellSize({ cellSize, ...rest });
  if (widthAt(preferred) <= budget) return preferred;
  if (widthAt(minimum) > budget) return minimum;
  let lo = minimum;
  let hi = preferred;
  for (let i = 0; i < 18; i += 1) {
    const mid = (lo + hi) / 2;
    if (widthAt(mid) <= budget) lo = mid;
    else hi = mid;
  }
  return lo;
};

const renderSvgTextLines = (text, keyPrefix) => {
  const lines = text.split('\n');
  if (lines.length === 1) {
    return text;
  }

  return lines.map((line, lineIdx) => (
    <tspan key={`${keyPrefix}-line-${lineIdx}`} x={0} dy={lineIdx === 0 ? 0 : `${X_LABEL_LINE_HEIGHT}em`}>
      {line}
    </tspan>
  ));
};

export const Renderer = forwardRef(
  (
    {
      width,
      height,
      data,
      xTerms,
      drilldown,
      termProps,
      hoveredCell,
      setHoveredCell,
      setClickedCell,
      onToggleExpandCollapse,
      colorScale,
      backgroundColor,
      marginLeft,
      xLabelRotation,
      showLegend,
      showMissingData,
      showDescMax,
      colorLegendWidth,
      colorLegendHeight,
      maxCellWidth,
      minCellWidth = 10,
      availableWidth = 0,
      minCellHeight = 10,
      rowOrdering = 'alphabetical',
      rowAggFn = 'mean',
      collapseSingleCell = false,
      defaultCellHeight = 15,
      setGraphWidth,
      setGraphHeight,
      scaleSvg = false,
      rendererMargins,
    },
    ref
  ) => {
    // Use provided margins or fall back to default
    const MARGIN = rendererMargins || DEFAULT_MARGIN;
    // The bounds (=area inside the axis) is calculated by substracting the margins
    const boundsWidth = width - MARGIN.right - marginLeft;

    // show only selected and top-level data points
    // const dataShow = data.filter((d) => (
    //   d.ylvl === 0 || (drilldown && drilldown.expanded.has(d.y))
    // ));
    const dataShow = data;

    // TODO: debug - why is "isPopulated" property not passed on correctly from Heatmap??
    // DEBUG: remove console log in prod
    // console.log(`[Renderer] drilldown:\n${JSON.stringify(drilldown)}`);
    // console.log(`[Renderer] termProps:\n${JSON.stringify(termProps)}`);

    const termScoreById = useMemo(() => computeTermAggregates(data, rowAggFn), [data, rowAggFn]);

    const drilldownOrdered = useMemo(() => {
      if (!drilldown?.length) return drilldown;
      const clone = JSON.parse(JSON.stringify(drilldown));
      const ordered = reorderAnatomyTree(clone, rowOrdering, termScoreById, rowAggFn);
      return collapseSingleCell ? hideLooseSingleCellRows(ordered) : ordered;
    }, [drilldown, rowOrdering, termScoreById, rowAggFn, collapseSingleCell]);

    // reorder y-axis terms according to hierarchy
    function orderLabelsHierarchically(objectList) {
      const orderedLabels = [];

      function traverse(children, depth, visible, embedLvls) {
        if (!children || !Array.isArray(children)) return;

        // Push the labels at the current depth
        children.forEach((child, idx, arr) => {
          if (visible && (child.isPopulated || showMissingData)) {
            const newLabel = {
              id: child.id,
              label: child.label,
              depth,
              isTopLevelTerm: child.isTopLevelTerm,
              isPopulated: child.isPopulated,
              isExpanded: child.isExpanded,
              isLastChild: idx === arr.length - 1,
              embeddedInLvls: idx === arr.length - 1 ? [...embedLvls.filter((x) => x !== depth)] : [...embedLvls],
            };
            orderedLabels.push(newLabel);
            traverse(child.children, depth + 1, child.isExpanded, [...newLabel.embeddedInLvls, depth + 1]);
          } else {
            // DEBUG: remove console log in prod
            // console.log(`[Renderer] not visible:\n${JSON.stringify(child)}`);
          }
        });
      }

      // Start traversal from the root
      traverse(objectList, 0, true, []);

      return orderedLabels;
    }

    const yTermsOrdered = orderLabelsHierarchically(drilldownOrdered);
    // console.log(`[Renderer] yTerms:\n${JSON.stringify(yTerms)}`);
    // console.log(`[Renderer] yTermsOrdered:\n${JSON.stringify(yTermsOrdered)}`);
    // TODO: filter out missing data?
    const yTermsOrderedCopy = JSON.parse(JSON.stringify(yTermsOrdered));
    const yLblOrdered = yTermsOrderedCopy;

    // Use xTerms.value for scale domain (unique key per column), xTerms.label for display
    const allXGroups = useMemo(() => xTerms.map((d) => d.value ?? d.label ?? 'Unknown'), [xTerms]);
    // const allYGroups = useMemo(() => [...new Set(yLblOrdered.map((d) => d.label))], [yLblOrdered]);
    const allYGroups = useMemo(() => [...new Set(yLblOrdered.map((d) => d.id))], [yLblOrdered]);

    // Cell width from settings is the preferred size. Shrink it, down to minCellWidth,
    // when that is what lets every column fit in the visible area.
    const preferredCellWidth = Math.max(Number(maxCellWidth) || 0, minCellWidth);
    const xCellWidth = fitCellWidth({
      preferred: preferredCellWidth,
      minimum: minCellWidth,
      availableWidth,
      domain: allXGroups,
      xTerms,
      xLabelRotation,
      marginLeft,
      marginRight: MARGIN.right,
    });
    const requiredXWidth = allXGroups.length * (xCellWidth + COLUMN_GAP);
    const xScale = useMemo(
      () => d3.scaleBand().range([0, requiredXWidth]).domain(allXGroups).padding(0.01),
      [requiredXWidth, allXGroups]
    );

    // Column centers are one band step apart. A shallow slant cannot hold 15px
    // type once that pitch gets small, so the labels tip toward upright and
    // keep as much of the design size as the column gap allows.
    const xLabelLayout = xLabelLayoutForPitch(xScale.step(), xLabelRotation, xTerms);
    const xLabelFontSize = xLabelLayout.fontSize;
    const xLabelRotationEffective = xLabelLayout.rotation;
    const xLabelMetrics = useMemo(() => labelMetrics(xLabelFontSize), [xLabelFontSize]);

    // Determine how much vertical space the rotated x-axis labels need so that
    // top labels are not clipped and bottom labels don't overlap the legend.
    const { topLabelSpace, bottomLabelSpace } = useMemo(() => {
      let maxTopText = '';
      let maxBottomText = '';
      xTerms.forEach((t) => {
        const top = t?.topLabel ?? t?.label ?? t?.value ?? '';
        const bottom = t?.bottomLabel ?? t?.label ?? t?.value ?? '';
        if (
          estimateLabelVerticalExtent(top, xLabelRotationEffective, xLabelMetrics) >
          estimateLabelVerticalExtent(maxTopText, xLabelRotationEffective, xLabelMetrics)
        ) {
          maxTopText = top;
        }
        if (
          estimateLabelExtentBelowAnchor(bottom, xLabelRotationEffective, xLabelMetrics) >
          estimateLabelExtentBelowAnchor(maxBottomText, xLabelRotationEffective, xLabelMetrics)
        ) {
          maxBottomText = bottom;
        }
      });
      return {
        topLabelSpace:
          estimateLabelVerticalExtent(maxTopText, xLabelRotationEffective, xLabelMetrics) + X_LABEL_PADDING,
        // Hang below the anchor, then leave room for the legend title drawn above posY.
        bottomLabelSpace:
          X_LABEL_ANCHOR_OFFSET +
          estimateLabelExtentBelowAnchor(maxBottomText, xLabelRotationEffective, xLabelMetrics) +
          COLOR_LEGEND_OVERFLOW_TOP +
          X_LABEL_PADDING,
      };
    }, [xTerms, xLabelRotationEffective, xLabelMetrics]);

    const effectiveMarginTop = Math.max(MARGIN.top, topLabelSpace);
    const bottomLabelGap = Math.max(DEFAULT_BOTTOM_LABEL_GAP, bottomLabelSpace);

    // Slanted top labels are anchored at the column center and run up-right, so the
    // right margin has to cover whatever sticks past the cells. The character-width
    // estimate sizes the first frame; the layout effect replaces it with the painted
    // glyph extent so wide letters are not clipped and narrow ones do not leave a gap.
    const topLabelMeasureKey = `${xLabelFontSize}|${xLabelRotationEffective}|${requiredXWidth}|${xTerms
      .map((term) => `${term.value ?? ''}\u0000${term.topLabel ?? term.label ?? ''}`)
      .join('\u0001')}`;
    const estimatedTopLabelRightOverflow = useMemo(
      () => estimateTopLabelRightOverflow(xTerms, xScale, xLabelRotationEffective, requiredXWidth, xLabelMetrics),
      [xTerms, xScale, xLabelRotationEffective, requiredXWidth, xLabelMetrics]
    );
    const [measuredTopLabelRightOverflow, setMeasuredTopLabelRightOverflow] = useState(null);
    const topLabelsRef = useRef(null);
    const hasMeasuredTopLabelOverflow =
      measuredTopLabelRightOverflow &&
      measuredTopLabelRightOverflow.key === topLabelMeasureKey &&
      measuredTopLabelRightOverflow.overflow != null;
    const topLabelRightOverflow = hasMeasuredTopLabelOverflow
      ? measuredTopLabelRightOverflow.overflow
      : estimatedTopLabelRightOverflow;
    const effectiveMarginRight = Math.max(MARGIN.right, topLabelRightOverflow + X_LABEL_PADDING);
    // Cells plus the right margin. This is the width the download serializes.
    const contentWidth = marginLeft + requiredXWidth + effectiveMarginRight;
    // Before glyphs are measured, keep at least the width the parent asked for so an
    // empty first render does not collapse the figure. Once measured, the glyph extent
    // wins — including when it is a little smaller than the character-width estimate.
    const svgWidth = hasMeasuredTopLabelOverflow ? contentWidth : Math.max(width, contentWidth);

    useLayoutEffect(() => {
      const labelGroup = topLabelsRef.current;
      if (!labelGroup) return undefined;
      let cancelled = false;
      const measure = () => {
        if (cancelled) return;
        const overflow = measureTopLabelRightOverflow(labelGroup, requiredXWidth);
        setMeasuredTopLabelRightOverflow((prev) => {
          if (
            prev &&
            prev.key === topLabelMeasureKey &&
            overflow != null &&
            prev.overflow != null &&
            Math.abs(prev.overflow - overflow) < 0.5
          ) {
            return prev;
          }
          if (prev && prev.key === topLabelMeasureKey && overflow == null && prev.overflow == null) return prev;
          return { key: topLabelMeasureKey, overflow };
        });
      };
      measure();
      const fontsReady = typeof document !== 'undefined' ? document.fonts?.ready : undefined;
      fontsReady?.then(() => measure());
      return () => {
        cancelled = true;
      };
    }, [topLabelMeasureKey, requiredXWidth]);

    // Keep the parent width in sync so tooltips and later renders use the same size.
    useEffect(() => {
      if (setGraphWidth && Math.abs(svgWidth - width) > 0.5) {
        setGraphWidth(svgWidth);
      }
    }, [svgWidth, width, setGraphWidth]);

    // Size rows from the desired cell height during this render. `height` is the
    // caller's requested size with the legend already removed; 0 means the rows
    // alone decide. A larger request stretches the band. A smaller one does not
    // collapse rows to minCellHeight (that fallback painted short cells until hover).
    const desiredCellBand = allYGroups.length * defaultCellHeight;
    const requestedCellBand = height - effectiveMarginTop - bottomLabelGap - MARGIN.bottom;
    const cellBandHeight = Math.max(desiredCellBand, requestedCellBand, 0);
    const svgHeight = effectiveMarginTop + cellBandHeight + bottomLabelGap + MARGIN.bottom + colorLegendHeight;

    const yScale = useMemo(
      () => d3.scaleBand().range([0, cellBandHeight]).domain(allYGroups).padding(0.01),
      [cellBandHeight, allYGroups]
    );

    // Keep parent state aligned before paint so the tooltip uses the same height.
    useLayoutEffect(() => {
      if (!setGraphHeight) return;
      setGraphHeight((current) => (Number(current) === svgHeight ? current : svgHeight));
    }, [svgHeight, setGraphHeight]);

    // Build the rectangles
    const allShapes = dataShow.map((d, i) => {
      const x = xScale(d.x);
      const y = yScale(d.y);
      const cellWidth = Math.max(xScale.bandwidth() - 4, minCellWidth);
      const cellHeight = Math.max(yScale.bandwidth() - 4, minCellHeight);

      if (d.value === null || !x || !y) {
        return null;
      }
      const idx = i;
      const fillColour = d.isExpressed ? colorScale(d.value) : '#cccccc';
      if (!termProps[d.termId]) {
        // console.log(`[Renderer] termProps[${d.termId}] not found`);
      }
      const strokeColour = termProps[d.termId].isTopLevelTerm ? colorScale(d.maxExp) : fillColour;
      const cellData = {
        geneId: d.geneId,
        geneName: d.geneName,
        geneUrlBgee: `/gene/${d.geneId}`,
        speciesId: d.speciesId,
        speciesLabel: d.speciesLabel,
        speciesUrl: d.speciesId ? `/species/${d.speciesId}` : undefined,
        anatEntityId: d.anatEntityId,
        anatEntityName: d.anatEntityName,
        anatEntityUrlOls: `http://purl.obolibrary.org/obo/${d.anatEntityId.replace(':', '_')}`,
        cellTypeId: d.cellTypeId,
        cellTypeName: d.cellTypeName,
        cellTypeUrlOls: `http://purl.obolibrary.org/obo/${d.cellTypeId.replace(':', '_')}`,
        xLabel: `${d.geneId} - ${d.geneName}`,
        yLabel: `${d.termId} - ${d.termName}`,
        xPos: x + xScale.bandwidth() + marginLeft,
        yPos: y + xScale.bandwidth() / 2 + MARGIN.bottom,
        value: Math.round(d.value * 100) / 100,
        isExpressed: d.isExpressed,
        expressionQuality: d.expressionQuality,
        // maxExpScore: d.maxExp.toFixed(2),
        hasDataAffy: d.hasDataAffy,
        hasDataEst: d.hasDataEst,
        hasDataInSitu: d.hasDataInSitu,
        hasDataRnaSeq: d.hasDataRnaSeq,
        hasDataScRnaSeq: d.hasDataScRnaSeq,
      };
      const getHoverData = (e, yLabel = `${d.termId} - ${d.termName}`) => ({
        speciesLabel: d.speciesLabel,
        xLabel: `${d.geneId} - ${d.geneName}`,
        yLabel,
        value: Math.round(d.value * 100) / 100,
        isExpressed: d.isExpressed,
        ...(d.maxExp != null && { maxExpScore: d.maxExp.toFixed(2) }),
        clientX: e.clientX + 10,
        clientY: e.clientY - 10,
      });

      // for central circle
      const r = (Math.min(cellWidth, cellHeight) / 2) * 0.9;
      const cx = x + cellWidth / 2;
      const cy = y + cellHeight / 2;

      // for horizonal split
      const w1 = cellWidth * (2 / 3);
      const w2 = cellWidth - w1;
      const x1 = x + w1;

      // return (
      //   <g id={`heatmapCell-${idx}`}>
      //     <rect
      //       key={`valueSelf-${idx}`}
      //       x={x}
      //       y={y}
      //       width={w1}
      //       height={cellHeight}
      //       opacity={1}
      //       fill={fillColour}
      //       strokeWidth={4}
      //       onMouseEnter={(e) => {
      //         setHoveredCell(cellData);
      //       }}
      //       onMouseLeave={() => setHoveredCell(null)}
      //       cursor="pointer"
      //     />

      //     <rect
      //       key={`valueDesc-${idx}`}
      //       x={x1}
      //       y={y}
      //       width={w2}
      //       height={cellHeight}
      //       opacity={1}
      //       fill={strokeColour}
      //       strokeWidth={4}
      //       onMouseEnter={(e) => {
      //         setHoveredCell(cellData);
      //       }}
      //       onMouseLeave={() => setHoveredCell(null)}
      //       cursor="pointer"
      //     />
      //   </g>
      // );

      switch (showDescMax) {
        case 'border':
          return (
            <rect
              key={`heatMapCell-${idx}`}
              r={3}
              x={xScale(d.x)}
              y={yScale(d.y)}
              width={xScale.bandwidth() - 4}
              height={yScale.bandwidth() - 4}
              opacity={1}
              fill={fillColour}
              rx={5}
              stroke={strokeColour}
              strokeWidth={4}
              onMouseEnter={(e) => {
                setHoveredCell(getHoverData(e));
              }}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => setClickedCell(cellData)}
              cursor="pointer"
            />
          );

        // show circle in center of cell
        case 'center':
          return (
            <g key={`heatmapCell-${idx}`}>
              <rect
                key={`valueSelf-${idx}`}
                x={xScale(d.x)}
                y={yScale(d.y)}
                width={xScale.bandwidth() - 4}
                height={yScale.bandwidth() - 4}
                opacity={1}
                fill={fillColour}
                rx={5}
                strokeWidth={1}
                onMouseEnter={(e) => {
                  setHoveredCell(getHoverData(e));
                }}
                onMouseLeave={() => setHoveredCell(null)}
                onClick={() => setClickedCell(cellData)}
                cursor="pointer"
              />

              <circle key={`valueDesc-${idx}`} r={r} cx={cx} cy={cy} fill={strokeColour} />
            </g>
          );

        // split data cell horizontally (max. desc. value on right)
        case 'split':
          return (
            <g key={`heatmapCell-${idx}`}>
              <rect
                key={`valueSelf-${idx}`}
                x={x}
                y={y}
                width={w1}
                height={cellHeight}
                opacity={1}
                fill={fillColour}
                strokeWidth={4}
                onMouseEnter={(e) => {
                  setHoveredCell({ ...cellData, clientX: e.clientX + 10, clientY: e.clientY - 10 });
                }}
                onMouseLeave={() => setHoveredCell(null)}
                onClick={() => setClickedCell(cellData)}
                cursor="pointer"
              />

              <rect
                key={`valueDesc-${idx}`}
                x={x1}
                y={y}
                width={w2}
                height={cellHeight}
                opacity={1}
                fill={strokeColour}
                strokeWidth={4}
                onMouseEnter={(e) => {
                  setHoveredCell({ ...cellData, clientX: e.clientX + 10, clientY: e.clientY - 10 });
                }}
                onMouseLeave={() => setHoveredCell(null)}
                onClick={() => setClickedCell(cellData)}
                cursor="pointer"
              />
            </g>
          );

        // do not show descendant value
        default:
          return (
            <rect
              key={`heatMapCell-${idx}`}
              r={3}
              x={xScale(d.x)}
              y={yScale(d.y)}
              width={xScale.bandwidth() - 2}
              height={yScale.bandwidth() - 2}
              opacity={1}
              fill={fillColour}
              rx={5}
              stroke="white"
              strokeWidth={2}
              onMouseEnter={(e) => {
                setHoveredCell(getHoverData(e, `${d.termName}`));
              }}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => setClickedCell(cellData)}
              cursor="pointer"
            />
          );
      }
    });

    const xLabelsTop = xTerms.map((term, i) => {
      const x = xScale(term.value ?? term.label);
      const xCoord = x + xScale.bandwidth() / 2;
      const yCoord = -10;
      const displayLabel = term.topLabel ?? term.label ?? term.value ?? 'Unknown';

      if (x === undefined) {
        return null;
      }

      return (
        <text
          key={`heatMapXLabel-${i}`}
          x={xLabelRotationEffective === 0 ? xCoord : null}
          y={xLabelRotationEffective === 0 ? yCoord : null}
          transform={
            xLabelRotationEffective !== 0 ? `translate(${xCoord}, ${yCoord}) rotate(${xLabelRotationEffective})` : null
          }
          textAnchor={xLabelRotationEffective === 0 ? 'middle' : 'start'}
          dominantBaseline="middle"
          fontSize={xLabelFontSize}
          fontFamily="Open Sans, sans-serif"
        >
          {renderSvgTextLines(displayLabel, `heatMapXLabel-${i}`)}
        </text>
      );
    });

    const xLabelsBottom = xTerms.map((term, i) => {
      const x = xScale(term.value ?? term.label);
      const xCoord = x + xScale.bandwidth() / 2;
      const actualHeatmapHeight = yScale.range()[1] || 0;
      const yCoord = actualHeatmapHeight + X_LABEL_ANCHOR_OFFSET;
      const displayLabel = term.bottomLabel ?? term.label ?? term.value ?? 'Unknown';

      if (x === undefined) {
        return null;
      }

      return (
        <text
          key={`heatMapXLabelBottom-${i}`}
          x={xLabelRotationEffective === 0 ? xCoord : null}
          y={xLabelRotationEffective === 0 ? yCoord : null}
          transform={
            xLabelRotationEffective !== 0 ? `translate(${xCoord}, ${yCoord}) rotate(${xLabelRotationEffective})` : null
          }
          textAnchor={xLabelRotationEffective === 0 ? 'middle' : 'end'}
          dominantBaseline="middle"
          fontSize={xLabelFontSize}
          fontFamily="Open Sans, sans-serif"
        >
          {renderSvgTextLines(displayLabel, `heatMapXLabelBottom-${i}`)}
        </text>
      );
    });

    // const [min = 0, max = 0] = d3.extent(data.map((d) => d.value)); // extent can return [undefined, undefined], default to [0,0] to fix types
    const domain = colorScale.domain();
    const max = domain[domain.length - 1];

    // create numbers 1..100
    const stopsIdx = Array(101)
      .fill()
      .map((_, index) => index);
    const colorLegendStops = stopsIdx.map((idx) => (
      <stop key={`colorLegendStop-${idx}`} stopColor={colorScale((max * idx) / 100)} offset={`${idx}%`} />
    ));
    const colorLegendPosX = 0;
    // Position legend after the main heatmap
    // Calculate the actual heatmap content height (yScale range height)
    const actualHeatmapHeight = yScale.range()[1] || 0;
    // Position legend just below the heatmap, with enough gap to clear the
    // (possibly rotated and long) bottom x-axis labels.
    const colorLegendPosY = actualHeatmapHeight + bottomLabelGap;

    return (
      <svg
        ref={ref}
        width={svgWidth}
        height={svgHeight}
        style={{ backgroundColor, display: 'block' }}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio={scaleSvg ? 'xMidYMid meet' : 'xMinYMin meet'}
      >
        <defs>
          <style>{`
          @font-face {
            font-family: 'Open Sans';
            src: url('data:application/font-woff;charset=utf-8;base64,${fonts.openSansWoff}') format('woff');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'Spectral Regular';
            src: url('data:application/font-woff;charset=utf-8;base64,${fonts.spectralRegularWoff}') format('woff');
            font-weight: normal;
            font-style: normal;
          }
        `}</style>
          <linearGradient id="colorLegendGradient">{colorLegendStops}</linearGradient>
        </defs>
        <g
          width={boundsWidth}
          height={cellBandHeight}
          transform={`translate(${[marginLeft, effectiveMarginTop].join(',')})`}
        >
          <g>
            <g>{allShapes}</g>
            <g ref={topLabelsRef}>{xLabelsTop}</g>
            <g>{xLabelsBottom}</g>
            <g transform={`translate(-${marginLeft - 10}, 5)`}>
              <Tree
                data={drilldownOrdered}
                yScale={yScale}
                toggleCollapse={onToggleExpandCollapse}
                labelFont="Open Sans"
              />
            </g>
          </g>

          <g transform={`translate(-${marginLeft - 50}, 0)`}>
            {showLegend ? (
              <g>
                <ColorLegendSvg
                  posX={colorLegendPosX}
                  posY={colorLegendPosY}
                  width={colorLegendWidth}
                  height={colorLegendHeight}
                  colorScale={colorScale}
                  interactionData={hoveredCell}
                />
              </g>
            ) : null}

            {showLegend ? (
              <g>
                <text
                  id="txtSecondaryLegend"
                  x={colorLegendPosX + colorLegendWidth + 25}
                  y={colorLegendPosY + COLOR_LEGEND_SWATCH_BASELINE}
                  dominantBaseline="middle"
                  fontSize={15}
                  fontFamily="sans"
                >
                  {showDescMax === 'border' ? 'Border color: max. expression score' : null}
                  {showDescMax === 'center' ? 'Central dot: max. expression score' : null}
                  {showDescMax === 'split' ? 'Right part of cell: max. expression score' : null}
                </text>
              </g>
            ) : null}
          </g>
        </g>
      </svg>
    );
  }
);

export default Renderer;
