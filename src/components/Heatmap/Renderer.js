import { useMemo, forwardRef } from "react";
import * as d3 from "d3";
import { Tree } from "./TreeSvg"
import { ColorLegendSvg } from "./ColorLegendSvg";
// import { Tooltip } from "../../../Tooltip";
// import styles from "./renderer.module.css";
import fonts from "./fonts";

const MARGIN = { top: 50, right: 10, bottom: 50, left: 200 };
const COLOR_LEGEND_MARGIN = { top: 0, right: 0, bottom: 50, left: 0 };

export const Renderer = forwardRef(({
  width,
  height,
  data,
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
  yLabelJustify,
  showLegend,
  showMissingData,
  showDescMax,
  colorLegendWidth,
  colorLegendHeight,
  maxCellWidth,
  minCellWidth = 20,
  minCellHeight = 10,
  maxGraphWidth = 1000,
  setGraphWidth,
}, ref) => {
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - marginLeft;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const colorLegendBoundsHeight =
    colorLegendHeight - COLOR_LEGEND_MARGIN.top - COLOR_LEGEND_MARGIN.bottom;

  // show only selected and top-level data points
  // const dataShow = data.filter((d) => (
  //   d.ylvl === 0 || (drilldown && drilldown.expanded.has(d.y))
  // ));
  const dataShow = data;

  // TODO: debug - why is "isPopulated" property not passed on correctly from Heatmap??
  // DEBUG: remove console log in prod
  // console.log(`[Renderer] drilldown:\n${JSON.stringify(drilldown)}`);
  // console.log(`[Renderer] termProps:\n${JSON.stringify(termProps)}`);

  // reorder y-axis terms according to hierarchy
  function orderLabelsHierarchically(objectList) {
    const orderedLabels = [];

    function traverse(children, depth, visible, embedLvls) {
      if (!children || !Array.isArray(children)) return;

      // collect low-level children
      const childrenLowLvl = children.filter((child) => !child.isTopLevelTerm)
        .sort((a, b) => a.label.localeCompare(b.label));
      // collect high-level children
      const childrenHighLvl = children.filter((child) => child.isTopLevelTerm)
        .sort((a, b) => a.label.localeCompare(b.label));

      // Sort the children based on the label
      children.sort((a, b) => a.label.localeCompare(b.label));

      // Push the labels at the current depth
      [...childrenLowLvl, ...childrenHighLvl].forEach((child, idx, arr) => {
      // children.forEach((child, idx, arr) => {
        if (visible && (child.isPopulated || showMissingData)) {
          const newLabel = {
            id: child.id,
            label: child.label,
            depth,
            isTopLevelTerm: child.isTopLevelTerm,
            isPopulated: child.isPopulated,
            isExpanded: child.isExpanded,
            isLastChild: (idx === arr.length-1),
            embeddedInLvls: (idx === arr.length-1) ? [...(embedLvls.filter(x => x!==depth))] : [...embedLvls],
          }
          orderedLabels.push(newLabel);
          traverse(child.children, depth + 1, child.isExpanded, [...(newLabel.embeddedInLvls), depth+1]);
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

  const drilldownCopy = JSON.parse(JSON.stringify(drilldown));
  const yTermsOrdered = orderLabelsHierarchically(drilldownCopy);
  // console.log(`[Renderer] yTerms:\n${JSON.stringify(yTerms)}`);
  // console.log(`[Renderer] yTermsOrdered:\n${JSON.stringify(yTermsOrdered)}`);
  // TODO: filter out missing data?
  const yTermsOrderedCopy = JSON.parse(JSON.stringify(yTermsOrdered));
  const yLblOrdered = yTermsOrderedCopy;

  // const allYGroups = useMemo(() => [...new Set(dataShow.map((d) => d.y))], [dataShow]);
  const allXGroups = useMemo(() => [...new Set(dataShow.map((d) => d.x))], [dataShow]);
  // const allYGroups = useMemo(() => [...new Set(yLblOrdered.map((d) => d.label))], [yLblOrdered]);
  const allYGroups = useMemo(() => [...new Set(yLblOrdered.map((d) => d.id))], [yLblOrdered]);

  const xScale = useMemo(() => {
    const cellWidth = Math.max(maxCellWidth, minCellWidth);
    // Calculate required width based on minimum cell width, including 4px margin
    const requiredWidth = allXGroups.length * (cellWidth + 4);
    if (requiredWidth > boundsWidth) {
      // Update graph width if needed
      setGraphWidth(requiredWidth + MARGIN.right + marginLeft);
    }

    return d3
      .scaleBand()
      .range([0, requiredWidth])
      .domain(allXGroups)
      .padding(0.01);
  }, [dataShow, width, maxCellWidth, minCellWidth, allXGroups, boundsWidth, marginLeft, setGraphWidth]);

  const yScale = useMemo(() => {
    // Calculate required height based on minimum cell height, including 4px margin
    const requiredHeight = allYGroups.length * (minCellHeight + 4);
    const actualHeight = Math.max(boundsHeight, requiredHeight);

    return d3
      .scaleBand()
      .range([0, actualHeight])
      .domain(allYGroups)
      .padding(0.01);
  }, [dataShow, height, minCellHeight, allYGroups, boundsHeight]);

  // Build the rectangles
  const allShapes = dataShow.map((d, i) => {
    const x = xScale(d.x);
    const y = yScale(d.y);
    const cellWidth = Math.max(xScale.bandwidth()-4, minCellWidth);
    const cellHeight = Math.max(yScale.bandwidth()-4, minCellHeight);

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
      geneUrlBgee: `https://www.bgee.org/gene/${d.geneId}`,
      speciesId: d.speciesId,
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
      // maxExpScore: d.maxExp.toFixed(2),
      hasDataAffy: d.hasDataAffy,
      hasDataEst: d.hasDataEst,
      hasDataInSitu: d.hasDataInSitu,
      hasDataRnaSeq: d.hasDataRnaSeq,
      hasDataScRnaSeq: d.hasDataScRnaSeq,
    };

    // for central circle
    const r = Math.min(cellWidth, cellHeight) / 2 * .9;
    const cx = x + (cellWidth / 2);
    const cy = y + (cellHeight / 2);

    // for horizonal split
    const w1 = cellWidth * (2/3);
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

    switch(showDescMax) {
      case 'border':
        return (
          <rect
            key={`heatMapCell-${idx}`}
            r={3}
            x={xScale(d.x)}
            y={yScale(d.y)}
            width={xScale.bandwidth()-4}
            height={yScale.bandwidth()-4}
            opacity={1}
            fill={fillColour}
            rx={5}
            stroke={strokeColour}
            strokeWidth={4}
            onMouseEnter={(e) => {
              setHoveredCell({
                xLabel: `${d.geneId} - ${d.geneName}`,
                yLabel: `${d.termId} - ${d.termName}`,
                value: Math.round(d.value * 100) / 100,
                isExpressed: d.isExpressed,
                maxExpScore: d.maxExp.toFixed(2),
                clientX: e.clientX + 10,
                clientY: e.clientY - 10
              });
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
            width={xScale.bandwidth()-4}
            height={yScale.bandwidth()-4}
            opacity={1}
            fill={fillColour}
            rx={5}
            strokeWidth={1}
            onMouseEnter={(e) => {
              setHoveredCell({
                xLabel: `${d.geneId} - ${d.geneName}`,
                yLabel: `${d.termId} - ${d.termName}`,
                value: Math.round(d.value * 100) / 100,
                isExpressed: d.isExpressed,
                maxExpScore: d.maxExp.toFixed(2),
                clientX: e.clientX + 10,
                clientY: e.clientY - 10
              });
            }}
            onMouseLeave={() => setHoveredCell(null)}
            onClick={() => setClickedCell(cellData)}
            cursor="pointer"
          />

          <circle
            key={`valueDesc-${idx}`}
            r = {r}
            cx = {cx}
            cy = {cy}
            fill = {strokeColour}
          />
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
              onMouseEnter={() => {
                setHoveredCell(cellData);
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
              onMouseEnter={() => {
                setHoveredCell(cellData);
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
            width={xScale.bandwidth()-2}
            height={yScale.bandwidth()-2}
            opacity={1}
            fill={fillColour}
            rx={5}
            stroke='white'
            strokeWidth={2}
            onMouseEnter={(e) => {
              setHoveredCell({
                xLabel: `${d.geneId} - ${d.geneName}`,
                yLabel: `${d.termId} - ${d.termName}`,
                value: Math.round(d.value * 100) / 100,
                isExpressed: d.isExpressed,
                // maxExpScore: d.maxExp.toFixed(2),
                clientX: e.clientX + 10,
                clientY: e.clientY - 10
              });
            }}
            onMouseLeave={() => setHoveredCell(null)}
            onClick={() => setClickedCell(cellData)}
            cursor="pointer"
          />
        );
    };

  });

  const xLabelsTop = allXGroups.map((name, i) => {
    const x = xScale(name);
    const xCoord = x + xScale.bandwidth() / 2;
    const yCoord = -10;
    // const yCoord = boundsHeight + 10 + (i % 2) * 20; // stagger labels

    if (!x) {
      return null;
    }

    const idx = i;
    return (
      <text
        key={`heatMapXLabel-${idx}`}
        x={xLabelRotation === 0 ? xCoord : null}
        y={xLabelRotation === 0 ? yCoord : null}
        transform={xLabelRotation !== 0 ? `translate(${xCoord}, ${yCoord}) rotate(${xLabelRotation})` : null}
        textAnchor={xLabelRotation === 0 ? "middle" : "start"}
        dominantBaseline="middle"
        fontSize={15}
        // transform="`rotate(-10) translate(${xCoord}, ${yCoord})`"
      >
        {name}
      </text>
    );
  });

  const xLabelsBottom = allXGroups.map((name, i) => {
    const x = xScale(name);
    const xCoord = x + xScale.bandwidth() / 2;
    const yCoord = boundsHeight + 10;
    // const yCoord = boundsHeight + 10 + (i % 2) * 20; // stagger labels

    if (!x) {
      return null;
    }

    const idx = i;
    return (
      <text
        key={`heatMapXLabel-${idx}`}
        x={xLabelRotation === 0 ? xCoord : null}
        y={xLabelRotation === 0 ? yCoord : null}
        transform={xLabelRotation !== 0 ? `translate(${xCoord}, ${yCoord}) rotate(${xLabelRotation})` : null}
        textAnchor={xLabelRotation === 0 ? "middle" : "end"}
        dominantBaseline="middle"
        fontSize={15}
        // transform="`rotate(-10) translate(${xCoord}, ${yCoord})`"
      >
        {name}
      </text>
    );
  });

  const yLabels = yLblOrdered.map((term, i) => {
    const y = yScale(term.label);

    if (!y) {
      return null;
    }

    const idx = i;
    // Calculate x position based on yLabelJustify
    const xPos = yLabelJustify === "left" ? -1 * marginLeft : -5;
    const anchor = yLabelJustify === "left" ? "start" : "end";
    // Calculate y position
    const yPos = y + yScale.bandwidth() / 2;
    // Change display depending on hierarchical level
    let lblTree = '';
    let lblIndicator = '';
    const lblTerm = term.label;
    if (term.depth > 0) {
      if (term.isTopLevelTerm) {
        lblIndicator = '?'; // '(?)';
        if (term.isExpanded) lblIndicator = '\u{025B3}'; // '^'
        // else if(term.hasBeenQueried) lblIndicator = '\u{025BD}'; // 'v';
        else lblIndicator = '<'; // 'v';
      }

      if (yLabelJustify === "left") {
        lblTree = `${'-'.repeat(2*term.depth)}${lblIndicator} ${term.label}`;
      }
      else {
        let suffix = '';
        for (let lvl=1; lvl <= term.depth; lvl+=1) {
          if (lvl === term.depth) {
            if (term.isLastChild) {
              suffix = `\u{02500}\u{02518}${suffix}`; // lower-right corner
            } else {
              // postfix = `\u{02500}\u{02525}${postfix}`;
              suffix = `\u{02500}\u{02524}${suffix}`; // t-crossing left
            }
          } else if (term.embeddedInLvls.includes(lvl)) {
            // postfix = `\u{02500}\u{02502}${postfix}`;
            suffix = `\u{000A0}\u{02502}${suffix}`; // vertical line
          } else {
            suffix = `\u{000A0}\u{000A0}${suffix}`; // blank space
          }
        }
        // displayText = `${term.label} ${indicator}${'-'.repeat(2*term.depth)}`;
        lblTree = `${suffix}`;
      }
    }
    // console.log(`[Renderer] yLabel: ${JSON.stringify(term)}`);

      // term.label + '\u{02518}' // '.'.repeat(2*term.depth);
      // term.label + ' '.repeat(2*term.depth);

    return (
      <text
        key={`heatMapYLabel-${idx}`}
        x={xPos}
        y={yPos}
        textAnchor={anchor}
        dominantBaseline="middle"
        fontSize={15}
        fontFamily="monospace"
        onClick={() => onToggleExpandCollapse(term)}
      >
        <tspan fontFamily="sans-serif">{lblTerm} </tspan>
        <tspan fill="red">{lblIndicator}</tspan>
        {lblTree}
      </text>
    );
  });

  // const [min = 0, max = 0] = d3.extent(data.map((d) => d.value)); // extent can return [undefined, undefined], default to [0,0] to fix types
  const domain = colorScale.domain();
  const max = domain[domain.length - 1];

  // create numbers 1..100
  const stopsIdx = Array(101).fill().map((_, index) => index);
  const colorLegendStops = stopsIdx.map((idx) => (
    <stop
      key={`colorLegendStop-${idx}`}
      stopColor={colorScale(max * idx / 100)}
      offset={`${idx}%`}
    />
  ));
  const colorLegendPosX = 0;
  const colorLegendPosY = height;

  return (
    <svg 
      ref={ref}
      width={Math.min(width, maxGraphWidth)} 
      height={height + colorLegendHeight}
      style={{ backgroundColor }}
      viewBox={`0 0 ${width} ${height + colorLegendHeight}`}
      preserveAspectRatio="xMidYMid meet"
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
        <linearGradient id="colorLegendGradient">
          {colorLegendStops}
        </linearGradient>
      </defs>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[marginLeft, MARGIN.top].join(",")})`}
      >
        {allShapes}
        {xLabelsTop}
        {xLabelsBottom}
      {false &&
        {yLabels}
      }

        <g transform={`translate(-${marginLeft-10}, 5)`} >
          <Tree
            data={drilldown}
            yScale={yScale}
            toggleCollapse={onToggleExpandCollapse}
            labelFont='Open Sans'
         />
        </g>

        <g transform={`translate(-${marginLeft-50}, 0)`} >
          {
            showLegend ?
            <g>
              <ColorLegendSvg
                posX={colorLegendPosX}
                posY={colorLegendPosY - 50}
                width={colorLegendWidth}
                height={colorLegendHeight}
                colorScale={colorScale}
                interactionData={hoveredCell}
              />
            </g>
            : null
          }

          {
            showLegend ?
            <g>
              <text
                id="txtSecondaryLegend"
                x={colorLegendPosX + colorLegendWidth + 25}
                y={colorLegendPosY + colorLegendBoundsHeight}
                dominantBaseline="middle"
                fontSize={15}
                fontFamily="sans"
              >
                { showDescMax === 'border' ? 'Border color: max. expression score' : null }
                { showDescMax === 'center' ? 'Central dot: max. expression score' : null }
                { showDescMax === 'split'  ? 'Right part of cell: max. expression score' : null }

              </text>
            </g>
            : null
          }
        </g>
      </g>
    </svg>
  );
});

export default Renderer;
