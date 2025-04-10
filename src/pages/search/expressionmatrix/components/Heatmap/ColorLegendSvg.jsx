import { useEffect, useRef } from "react";
import * as d3 from "d3";
// TypeSript specific
// import { InteractionData } from "./Heatmap";

/* TypeScript specific
type ColorLegendProps = {
  height: number;
  width: number;
  colorScale: d3.ScaleLinear<string, string, never>;
  interactionData: InteractionData | null;
};
*/

const COLOR_LEGEND_MARGIN = { top: 0, right: 0, bottom: 50, left: 0 };

export const ColorLegendSvg = ({
  posX,
  posY,
  height,
  colorScale,
  width,
  interactionData,
}) => {
// }: ColorLegendProps) => { // TypeScript specific
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef(null);

  const boundsWidth =
    width - COLOR_LEGEND_MARGIN.right - COLOR_LEGEND_MARGIN.left;
  const boundsHeight =
    height - COLOR_LEGEND_MARGIN.top - COLOR_LEGEND_MARGIN.bottom;

  const domain = colorScale.domain();
  const max = domain[domain.length - 1];
  const xScale = d3.scaleLinear().range([0, boundsWidth]).domain([0, max]);

  const allTicks = xScale.ticks(4).map((tick) => (
      <g key={`ColorLegendTick-${tick}`}>
        <line
          x1={posX + xScale(tick)}
          x2={posX + xScale(tick)}
          y1={posY}
          y2={posY + boundsHeight + 10}
          stroke="black"
        />
        <text
          x={posX + xScale(tick)}
          y={posY + boundsHeight + 20}
          fontSize={9}
          textAnchor="middle"
        >
          {tick}
        </text>
      </g>
  ));

  const hoveredValue = interactionData?.value;
  const x = hoveredValue ? xScale(hoveredValue) : null;
  const triangleWidth = 9;
  const triangleHeight = 6;
  const triangle = x ? (
    <polygon
      points={`${x},${posY} ${x - triangleWidth / 2},${posY-triangleHeight} ${
        x + triangleWidth / 2
      },${posY-triangleHeight}`}
      fill="grey"
    />
  ) : null;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas?.getContext("2d");

    if (!context) {
      return;
    }

    for (let i = 0; i < boundsWidth; i+=1) {
      context.fillStyle = colorScale((max * i) / boundsWidth);
      context.fillRect(i, 0, 1, boundsHeight);
    }
  }, [width, height, colorScale]);

  return (
    <g>
      <text
        x={posX}
        y={posY - 10}
        fontSize={10}
        textAnchor="left"
        fontWeight="bold"
      >
        Expression score
      </text>
      <g>
        <rect id="colorLegend"
          x={posX} y={posY + 5} 
          width={width}
          height={boundsHeight}
          fill="url(#colorLegendGradient)"
        />
        {allTicks}
        {triangle}
      </g>
      <g>
        <rect id="rectNotExpressed" 
          x={posX}
          y={posY + 40}
          width={10}
          height={10}
          fill="#cccccc"
          stroke="black"
          strokeWidth={1}
          rx={4}
        />
        <text 
          x={posX + 15} 
          y={posY + 48}
          fontSize={10}
          textAnchor="left">
          Not expressed
        </text>
      </g>
      <g>
        <rect id="rectNoData" 
          x={posX + 100}
          y={posY + 40}
          width={10}
          height={10}
          fill="white"
          stroke="black"
          strokeWidth={1}
          rx={4}
        />
        <text 
          x={posX + 115} 
          y={posY + 48}
          fontSize={10}
          textAnchor="left">
          No data
        </text>
      </g>
    </g>
  );
};

export default ColorLegendSvg;