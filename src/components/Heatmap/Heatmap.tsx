import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import * as d3 from 'd3';
import Bulma from '../Bulma';
import { Renderer } from './Renderer';
import { Tooltip } from './Tooltip';
import { DetailView } from './DetailView';
import { COLORS, THRESHOLDS, COLOR_LEGEND_HEIGHT } from './constants';
import { computeTermAggregates, pickWinnerChildIdForRoot } from './heatmapAggregates';

const SHOW_DEBUG_OPTIONS = false;

// Add constant for localStorage key
const STORAGE_KEYS = {
  USE_ADAPTIVE_SCALE: 'bgee-heatmap-adaptive-scale',
  CELL_WIDTH: 'bgee-heatmap-cell-width',
  SHOW_LEGEND: 'bgee-heatmap-show-legend',
  MARGIN_LEFT: 'bgee-heatmap-margin-left',
  X_LABEL_ROTATION: 'bgee-heatmap-x-label-rotation',
  Y_LABEL_ALIGN: 'bgee-heatmap-y-label-align',
  COLOR_PALETTE: 'bgee-heatmap-color-palette',
  BACKGROUND_COLOR: 'bgee-heatmap-background-color',
  SHOW_DESC_MAX: 'bgee-heatmap-show-desc-max',
  SHOW_MISSING_DATA: 'bgee-heatmap-show-missing-data',
  SHOW_SETTINGS: 'bgee-heatmap-show-settings',
  ROW_ORDERING: 'bgee-heatmap-row-ordering',
  ROW_AGG_FN: 'bgee-heatmap-row-agg-fn',
  AUTO_EXPAND_MOST_EXPRESSED: 'bgee-heatmap-auto-expand-most-expressed',
};

// Add helper function
const getStoredValue = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  if (stored === null) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch {
    return stored;
  }
};

/** Explicit props so callers are not required to pass matrix-only / debug options. */
export type HeatmapProps = {
  width: number;
  height?: number;
  backgroundColor?: string;
  /** Row / cell payload (untyped until heatmap data is modeled). */
  data: any;
  getChildData?: any;
  xTerms?: any;
  yTerms: any;
  termProps: any;
  yLabelJustify?: string;
  onToggleExpandCollapse: any;
  onSyncTopLevelAutoExpand?: any;
  isLoading?: boolean;
  isInitializingFromUrl?: boolean;
  defaultXLabelRotation?: unknown;
  defaultMaxGraphWidth?: unknown;
  defaultCellHeight?: unknown;
  showResetButton?: unknown;
  rendererMargins?: unknown;
};

const Heatmap = ({
  width,
  height = 800,
  backgroundColor = '#ffffff',
  data,
  yTerms,
  termProps,
  yLabelJustify = 'right',
  onToggleExpandCollapse,
  onSyncTopLevelAutoExpand,
  isLoading = false,
  isInitializingFromUrl = false,
  ..._heatmapMatrixOnlyOpts
}: HeatmapProps) => {
  void _heatmapMatrixOnlyOpts;
  // COMPONENT STATE
  const [hoveredCell, setHoveredCell] = useState(null);
  const [clickedCell, setClickedCell] = useState(null);
  const [showLegend, setShowLegend] = useState(() => getStoredValue(STORAGE_KEYS.SHOW_LEGEND, true));
  const [xLabelRotation, setXLabelRotation] = useState(() => getStoredValue(STORAGE_KEYS.X_LABEL_ROTATION, 0));
  const [yLabelAlign, setYLabelAlign] = useState(() => getStoredValue(STORAGE_KEYS.Y_LABEL_ALIGN, yLabelJustify));
  const [graphWidth, setGraphWidth] = useState(width);
  const [graphHeight, setGraphHeight] = useState(height);
  // outer width, if graphWidth > maxGraphWidth -> scale SVG down
  const [maxGraphWidth, setMaxGraphWidth] = useState(800);
  const [cellWidth, setCellWidth] = useState(() => getStoredValue(STORAGE_KEYS.CELL_WIDTH, 50));
  const [colorPalette, setColorPalette] = useState(() => getStoredValue(STORAGE_KEYS.COLOR_PALETTE, 'viridis'));
  const [bgColor, setBgColor] = useState(() => getStoredValue(STORAGE_KEYS.BACKGROUND_COLOR, backgroundColor));
  const [marginLeft, setMarginLeft] = useState(() => getStoredValue(STORAGE_KEYS.MARGIN_LEFT, 200));
  const [showDescMax, setShowDescMax] = useState(() => getStoredValue(STORAGE_KEYS.SHOW_DESC_MAX, 'none'));
  const [showMissingData, setShowMissingData] = useState(() => getStoredValue(STORAGE_KEYS.SHOW_MISSING_DATA, true));
  const [showSettings, setShowSettings] = useState(() => getStoredValue(STORAGE_KEYS.SHOW_SETTINGS, false));
  const [useAdaptiveScale, setUseAdaptiveScale] = useState(() =>
    getStoredValue(STORAGE_KEYS.USE_ADAPTIVE_SCALE, false)
  );
  const [rowOrdering, setRowOrdering] = useState(() => getStoredValue(STORAGE_KEYS.ROW_ORDERING, 'alphabetical'));
  const [rowAggFn, setRowAggFn] = useState(() => getStoredValue(STORAGE_KEYS.ROW_AGG_FN, 'mean'));
  const [autoExpandMostExpressed, setAutoExpandMostExpressed] = useState(() =>
    getStoredValue(STORAGE_KEYS.AUTO_EXPAND_MOST_EXPRESSED, true)
  );

  // Add state to track input values during editing
  const [graphWidthInput, setGraphWidthInput] = useState(maxGraphWidth);
  const [graphHeightInput, setGraphHeightInput] = useState(graphHeight);

  // Update local input state without updating the actual graphWidth
  const handleGraphWidthChange = (event) => {
    setGraphWidthInput(event.target.value);
  };

  // Update the actual graphWidth and localStorage on blur
  const handleGraphWidthBlur = (event) => {
    const { value } = event.target;
    setMaxGraphWidth(value);
  };

  // Update local input state without updating the actual graphHeight
  const handleGraphHeightChange = (event) => {
    setGraphHeightInput(event.target.value);
  };

  // Update the actual graphHeight and localStorage on blur
  const handleGraphHeightBlur = (event) => {
    const { value } = event.target;
    setGraphHeight(value);
  };

  // Move visibleTermIds before colorScale
  // Memoize the visible term IDs calculation
  const visibleTermIds = useMemo(() => {
    const ids = new Set();

    const traverse = (term) => {
      ids.add(term.id);
      if (term.isExpanded && term.children) {
        term.children.forEach(traverse);
      }
    };

    yTerms.forEach(traverse);
    return ids;
  }, [yTerms]);

  // Update the colorScale useMemo to use adaptive scale
  const colorScale = useMemo(() => {
    // Filter values to only include visible terms
    const visibleValues = data
      .filter((d) => visibleTermIds.has(d.y))
      .map((d) => d.value)
      .filter((d) => d !== null);

    const maxValue = useAdaptiveScale ? Math.max(...visibleValues, 0) : 100;

    return d3
      .scaleLinear()
      .domain(THRESHOLDS.map((t) => t * maxValue))
      .range(COLORS[colorPalette]);
  }, [data, visibleTermIds, colorPalette, useAdaptiveScale]);

  // handle display property changes
  const updateCellWidth = ({ target: { value } }) => {
    setCellWidth(value);
    localStorage.setItem(STORAGE_KEYS.CELL_WIDTH, JSON.stringify(value));
  };

  const updateShowLegend = () => {
    const value = !showLegend;
    setShowLegend(value);
    localStorage.setItem(STORAGE_KEYS.SHOW_LEGEND, JSON.stringify(value));
  };

  const updateYLabelWidth = ({ target: { value } }) => {
    setMarginLeft(value);
    localStorage.setItem(STORAGE_KEYS.MARGIN_LEFT, JSON.stringify(value));
  };

  const updateXLabelRotation = ({ target: { value } }) => {
    try {
      const parsedValue = parseInt(value, 10);
      setXLabelRotation(parsedValue);
      localStorage.setItem(STORAGE_KEYS.X_LABEL_ROTATION, JSON.stringify(parsedValue));
    } catch (error) {
      console.error(`[Heatmap] updateXLabelRotation: ${error}`);
    }
  };

  const updateYLabelAlign = ({ target: { value } }) => {
    setYLabelAlign(value);
    localStorage.setItem(STORAGE_KEYS.Y_LABEL_ALIGN, JSON.stringify(value));
  };

  const updateColorPalette = ({ target: { value } }) => {
    setColorPalette(value);
    localStorage.setItem(STORAGE_KEYS.COLOR_PALETTE, JSON.stringify(value));
  };

  const updateBgColor = ({ target: { value } }) => {
    setBgColor(value);
    localStorage.setItem(STORAGE_KEYS.BACKGROUND_COLOR, JSON.stringify(value));
  };

  const updateShowDescMax = ({ target: { value } }) => {
    setShowDescMax(value);
    localStorage.setItem(STORAGE_KEYS.SHOW_DESC_MAX, JSON.stringify(value));
  };

  const updateShowMissingData = () => {
    const value = !showMissingData;
    setShowMissingData(value);
    localStorage.setItem(STORAGE_KEYS.SHOW_MISSING_DATA, JSON.stringify(value));
  };

  const updateShowSettings = () => {
    const value = !showSettings;
    setShowSettings(value);
    localStorage.setItem(STORAGE_KEYS.SHOW_SETTINGS, JSON.stringify(value));
  };
  const updateRowOrdering = ({ target: { value } }) => {
    setRowOrdering(value);
    localStorage.setItem(STORAGE_KEYS.ROW_ORDERING, value);
  };
  const updateRowAggFn = ({ target: { value } }) => {
    setRowAggFn(value);
    localStorage.setItem(STORAGE_KEYS.ROW_AGG_FN, value);
    if (isLoading || isInitializingFromUrl || !autoExpandMostExpressed) return;
    if (!data?.length || !yTerms?.length) return;
    const scoreMap = computeTermAggregates(data, value);
    const winnerIds = yTerms.map((root) => pickWinnerChildIdForRoot(root, scoreMap));
    onSyncTopLevelAutoExpand?.(winnerIds);
  };
  const updateAutoExpandMostExpressed = () => {
    const value = !autoExpandMostExpressed;
    setAutoExpandMostExpressed(value);
    localStorage.setItem(STORAGE_KEYS.AUTO_EXPAND_MOST_EXPRESSED, JSON.stringify(value));
  };

  // Add handler for adaptive scale toggle
  const updateUseAdaptiveScale = () => {
    const value = !useAdaptiveScale;
    setUseAdaptiveScale(value);
    localStorage.setItem(STORAGE_KEYS.USE_ADAPTIVE_SCALE, JSON.stringify(value));
  };

  // DEBUG: remove console log in prod
  // console.log(`[Heatmap] yTerms:\n${JSON.stringify(yTerms, null, 2)}`);
  // console.log(`[Heatmap] data:\n${JSON.stringify(data)}`);

  // choose plot dimensions based on number of visible terms (y axis) and longest term label
  useEffect(() => {
    // console.log(`[Heatmap] (Re)calculating graph height...`);
    // console.log(`[Heatmap] drilldown:\n${JSON.stringify(drilldown)}`);
    function countVisibleTerms(terms) {
      let count = 0;
      let maxLabelLength = 0;

      function traverse(item) {
        count += 1;
        maxLabelLength = Math.max(maxLabelLength, item.label.length);
        if (item.isExpanded) {
          if (item.children && item.children.length > 0) {
            item.children.forEach(traverse);
          }
        }
      }

      terms.forEach(traverse);
      return { count, maxLabelLength };
    }

    const { count: numVisibleTerms, maxLabelLength } = countVisibleTerms(yTerms);
    // console.log(`[Heatmap] ${numVisibleTerms} visible terms`);
    // console.log(`[Heatmap] yTerms:\n${JSON.stringify(yTerms, null, 2)}`);
    const flexHeight = Math.max(numVisibleTerms * 30 + COLOR_LEGEND_HEIGHT, 250);
    const flexMarginLeft = Math.max(maxLabelLength * 7.5 + 50, marginLeft);
    const flexWidth = Math.max(flexMarginLeft + 50, graphWidth);
    setGraphHeight(flexHeight);
    setGraphWidth(flexWidth);
    setMarginLeft(flexMarginLeft);
  }, [yTerms]);

  const displayData = useMemo(() => (data?.length ? [...data].sort((a, b) => a.y.localeCompare(b.y)) : data), [data]);

  const topLevelAutoExpandWinners = useMemo(() => {
    if (!autoExpandMostExpressed || !data?.length || !yTerms?.length) {
      return { key: null as string | null, winnerIds: null as string[] | null };
    }
    const scoreMap = computeTermAggregates(data, rowAggFn);
    const winnerIds = yTerms.map((root) => pickWinnerChildIdForRoot(root, scoreMap));
    const key = `${rowAggFn}::${winnerIds.map((id) => (id == null ? '∅' : String(id))).join('|')}`;
    return { key, winnerIds };
  }, [autoExpandMostExpressed, data, rowAggFn, yTerms]);

  const syncTopLevelAutoExpandRef = useRef(onSyncTopLevelAutoExpand);
  syncTopLevelAutoExpandRef.current = onSyncTopLevelAutoExpand;

  useLayoutEffect(() => {
    if (isLoading || isInitializingFromUrl) return;
    if (topLevelAutoExpandWinners.key === null || !topLevelAutoExpandWinners.winnerIds) return;
    const sync = syncTopLevelAutoExpandRef.current;
    if (!sync) return;
    sync(topLevelAutoExpandWinners.winnerIds);
  }, [isLoading, isInitializingFromUrl, topLevelAutoExpandWinners]);

  const downloadTsv = () => {
    if (!data) return;

    // Extract headers from the first object
    const headers = Object.keys(data[0]);

    // Convert headers to a tab-separated string
    const headerString = headers.join('\t');

    // Convert each JSON object to a tab-separated string
    const dataStrings = data.map((obj) => headers.map((header) => obj[header]).join('\t'));

    // Combine headers and data strings into a single string
    const tsvString = [headerString, ...dataStrings].join('\n');

    const tsvBlob = new Blob([tsvString], { type: 'text/tab-separated-values;charset=utf-8' });
    const tsvUrl = URL.createObjectURL(tsvBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = tsvUrl;
    downloadLink.download = 'Bgee-genex-heatmap.tsv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const svgRef = useRef<SVGSVGElement | null>(null);
  const downloadSvg = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'Bgee-genex-heatmap.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const downloadPng = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    // Create a Blob from the SVG
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create an Image object to load the SVG
    const img = new Image();
    img.onload = () => {
      // Create a canvas with the same dimensions
      const canvas = document.createElement('canvas');
      canvas.width = svgElement.width.baseVal.value;
      canvas.height = svgElement.height.baseVal.value;

      // Draw the image onto the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Convert canvas to PNG and trigger download
      canvas.toBlob((blob) => {
        if (!blob) return;

        const pngUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'Bgee-genex-heatmap.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(pngUrl);
      }, 'image/png');
    };
    img.src = svgUrl;
  };

  return (
    <div className="heatmap-container" style={{ backgroundColor: bgColor }}>
      <div className="columns is-gapless">
        <div className="column">
          <Renderer
            ref={svgRef}
            width={graphWidth}
            height={graphHeight - COLOR_LEGEND_HEIGHT}
            backgroundColor={bgColor}
            data={displayData}
            drilldown={yTerms}
            termProps={termProps}
            hoveredCell={hoveredCell}
            setHoveredCell={setHoveredCell}
            clickedCell={clickedCell}
            setClickedCell={setClickedCell}
            onToggleExpandCollapse={onToggleExpandCollapse}
            colorScale={colorScale}
            marginLeft={marginLeft}
            xLabelRotation={xLabelRotation}
            showLegend={showLegend}
            showMissingData={showMissingData}
            showDescMax={showDescMax}
            colorLegendWidth={200}
            colorLegendHeight={COLOR_LEGEND_HEIGHT}
            maxCellWidth={cellWidth}
            maxGraphWidth={maxGraphWidth}
            setGraphWidth={setGraphWidth}
            rowOrdering={rowOrdering}
            rowAggFn={rowAggFn}
          />

          <Tooltip interactionData={hoveredCell} width={graphWidth} height={graphHeight - COLOR_LEGEND_HEIGHT} />
        </div>

        {clickedCell && (
          <div className="column is-4">
            <DetailView
              interactionData={clickedCell}
              xPos={0}
              yPos={0}
              width={500}
              style={{
                position: 'sticky',
                top: '1rem',
              }}
              onClose={() => setClickedCell(null)}
            />
          </div>
        )}
      </div>

      <div
        className="card"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <header className="card-header">
          <div className="card-header-title">
            <span className="mr-2">Download</span>
            <Bulma.Button
              className="download-btn is-small mr-2"
              onClick={downloadPng}
              renderAs="a"
              target="_blank"
              rel="noreferrer"
            >
              PNG
              <span className="icon is-small ml-1">
                <ion-icon name="download-outline" />
              </span>
            </Bulma.Button>

            <Bulma.Button
              className="download-btn is-small mr-2"
              onClick={downloadSvg}
              renderAs="a"
              target="_blank"
              rel="noreferrer"
            >
              SVG
              <span className="icon is-small ml-1">
                <ion-icon name="download-outline" />
              </span>
            </Bulma.Button>

            <Bulma.Button
              className="download-btn is-small mr-2"
              onClick={downloadTsv}
              renderAs="a"
              target="_blank"
              rel="noreferrer"
            >
              TSV
              <span className="icon is-small ml-1">
                <ion-icon name="download-outline" />
              </span>
            </Bulma.Button>
          </div>
        </header>
      </div>

      <div
        className="card"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <header className="card-header">
          <p className="card-header-title">
            Settings
            <span style={{ marginLeft: '10px' }} />
            <a href="#collapsible-settings" data-action="collapse" onClick={updateShowSettings}>
              {showSettings ? 'Collapse' : 'Expand'}
            </a>
          </p>
        </header>

        <div id="collapsible-settings" className={`is-collapsible ${showSettings ? 'is-active' : ''}`}>
          {showSettings ? (
            <div className="card-content">
              <div className="columns">
                <div className="column">
                  <h1>DISPLAY</h1>
                  <table>
                    <tbody>
                      <tr>
                        <td>Graph width:</td>
                        <td>
                          <input
                            type="text"
                            size={10}
                            value={graphWidthInput}
                            onChange={handleGraphWidthChange}
                            onBlur={handleGraphWidthBlur}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Graph height:</td>
                        <td>
                          <input
                            type="text"
                            size={10}
                            value={graphHeightInput}
                            onChange={handleGraphHeightChange}
                            onBlur={handleGraphHeightBlur}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Cell width:</td>
                        <td>
                          <input type="text" size={10} value={cellWidth} onChange={updateCellWidth} />
                        </td>
                      </tr>
                      <tr>
                        <td>Show Legend:</td>
                        <td>
                          <input type="checkbox" checked={showLegend} onChange={updateShowLegend} />
                        </td>
                      </tr>
                      <tr>
                        <td>Y label width:</td>
                        <td>
                          <input type="text" size={10} value={marginLeft} onChange={updateYLabelWidth} />
                        </td>
                      </tr>
                      {SHOW_DEBUG_OPTIONS ? (
                        <tr>
                          <td>X label rotation:</td>
                          <td>
                            <input type="text" size={10} value={xLabelRotation} onChange={updateXLabelRotation} />
                          </td>
                        </tr>
                      ) : null}
                      {SHOW_DEBUG_OPTIONS ? (
                        <tr>
                          <td>Y label justify:</td>
                          <td>
                            <select value={yLabelAlign} onChange={updateYLabelAlign}>
                              <option value="left">left</option>
                              <option value="right">right</option>
                            </select>
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
                <div className="column">
                  <h1>STYLE</h1>
                  <table>
                    <tbody>
                      <tr>
                        <td>color palette:</td>
                        <td>
                          <select value={colorPalette} onChange={updateColorPalette}>
                            <option value="magma">magma</option>
                            <option value="inferno">inferno</option>
                            <option value="plasma">plasma</option>
                            <option value="viridis">viridis</option>
                            <option value="cividis">cividis</option>
                            <option value="rocket">rocket</option>
                            <option value="mako">mako</option>
                            <option value="turbo">turbo</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>background color:</td>
                        <td>
                          <input type="text" size={10} value={bgColor} onChange={updateBgColor} />
                        </td>
                      </tr>
                      <tr>
                        <td>adaptive color scale:</td>
                        <td>
                          <input type="checkbox" checked={useAdaptiveScale} onChange={updateUseAdaptiveScale} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="column">
                  <div>
                    <h1>DATA</h1>
                    <table>
                      <tbody>
                        {SHOW_DEBUG_OPTIONS ? (
                          <tr>
                            <td>Show missing data:</td>
                            <td>
                              <input type="checkbox" checked={showMissingData} onChange={updateShowMissingData} />
                            </td>
                          </tr>
                        ) : null}
                        <tr>
                          <td>Row ordering:</td>
                          <td>
                            <select value={rowOrdering} onChange={updateRowOrdering}>
                              <option value="alphabetical">alphabetically</option>
                              <option value="expression">expression score</option>
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td>Aggregation function:</td>
                          <td>
                            <select
                              value={rowAggFn}
                              onChange={updateRowAggFn}
                              disabled={
                                rowOrdering !== 'expression' && !(autoExpandMostExpressed && onSyncTopLevelAutoExpand)
                              }
                            >
                              <option value="mean">mean</option>
                              <option value="max">max</option>
                            </select>
                          </td>
                        </tr>
                        {onSyncTopLevelAutoExpand ? (
                          <tr>
                            <td>Auto-expand most expressed:</td>
                            <td>
                              <input
                                type="checkbox"
                                checked={autoExpandMostExpressed}
                                onChange={updateAutoExpandMostExpressed}
                              />
                            </td>
                          </tr>
                        ) : null}
                        {SHOW_DEBUG_OPTIONS ? (
                          <tr>
                            <td>Show max. descendant score as:</td>
                            <td>
                              <select value={showDescMax} onChange={updateShowDescMax}>
                                <option value="border">border</option>
                                <option value="center">center</option>
                                <option value="split">split cell</option>
                                <option value="none">none</option>
                              </select>
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
