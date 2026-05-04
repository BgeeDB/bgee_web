import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { Download } from 'lucide-react';

import Bulma from '../../../../../components/Bulma';
import { Renderer } from './Renderer';
import { Tooltip } from './Tooltip';
import { DetailView } from './DetailView';
import { COLORS, THRESHOLDS, COLOR_LEGEND_HEIGHT } from './constants';
import { computeTermAggregates, pickWinnerChildIdForRoot } from './heatmapAggregates';

const SHOW_DEBUG_OPTIONS = false;
const ROW_HEIGHT_PX = 16;
const EXTRA_VERTICAL_SPACE_PX = 140;
const MIN_GRAPH_HEIGHT_PX = 360;

// Add constants for localStorage keys
const STORAGE_KEYS = {
  GRAPH_WIDTH: 'bgee-heatmap-width',
  GRAPH_HEIGHT: 'bgee-heatmap-height',
  SHOW_LEGEND: 'bgee-heatmap-show-legend',
  MARGIN_LEFT: 'bgee-heatmap-margin-left',
  X_LABEL_ROTATION: 'bgee-heatmap-x-rotation',
  Y_LABEL_ALIGN: 'bgee-heatmap-y-align',
  COLOR_PALETTE: 'bgee-heatmap-color-palette',
  BG_COLOR: 'bgee-heatmap-bg-color',
  SHOW_DESC_MAX: 'bgee-heatmap-show-desc-max',
  SHOW_MISSING_DATA: 'bgee-heatmap-show-missing',
  USE_ADAPTIVE_SCALE: 'bgee-heatmap-adaptive-scale',
  ROW_ORDERING: 'bgee-heatmap-row-ordering',
  ROW_AGG_FN: 'bgee-heatmap-row-agg-fn',
  AUTO_EXPAND_MOST_EXPRESSED: 'bgee-heatmap-auto-expand-most-expressed',
};

// Helper function to get stored value with default
const getStoredValue = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  if (stored === null) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch {
    return stored;
  }
};

export const Heatmap = ({
  width,
  height = 800,
  backgroundColor,
  data,
  getHomologsData,
  xTerms,
  yTerms,
  termProps,
  yLabelJustify = 'right',
  onToggleExpandCollapse,
  onSyncTopLevelAutoExpand,
  isInitializingFromUrl = false,
  isLoading,
}) => {
  // COMPONENT STATE
  const [hoveredCell, setHoveredCell] = useState(null);
  const [clickedCell, setClickedCell] = useState(null);
  const [showLegend, setShowLegend] = useState(() => getStoredValue(STORAGE_KEYS.SHOW_LEGEND, true));
  const [xLabelRotation, setXLabelRotation] = useState(() => getStoredValue(STORAGE_KEYS.X_LABEL_ROTATION, 325));
  const [yLabelAlign, setYLabelAlign] = useState(() => getStoredValue(STORAGE_KEYS.Y_LABEL_ALIGN, yLabelJustify));
  const [graphWidth, setGraphWidth] = useState(width);
  const [graphHeight, setGraphHeight] = useState(height);
  // outer width, if graphWidth > maxGraphWidth -> scale SVG down
  const [maxGraphWidth, setMaxGraphWidth] = useState(1500);
  const [colorPalette, setColorPalette] = useState(() => getStoredValue(STORAGE_KEYS.COLOR_PALETTE, 'viridis'));
  const [bgColor, setBgColor] = useState(() => getStoredValue(STORAGE_KEYS.BG_COLOR, backgroundColor));
  const [marginLeft, setMarginLeft] = useState(() => getStoredValue(STORAGE_KEYS.MARGIN_LEFT, 200));
  const [showDescMax, setShowDescMax] = useState(() => getStoredValue(STORAGE_KEYS.SHOW_DESC_MAX, 'none'));
  const [showMissingData, setShowMissingData] = useState(() => getStoredValue(STORAGE_KEYS.SHOW_MISSING_DATA, true));
  const [showHomologs, setShowHomologs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
    localStorage.setItem(STORAGE_KEYS.GRAPH_WIDTH, value);
  };

  // Update local input state without updating the actual graphHeight
  const handleGraphHeightChange = (event) => {
    setGraphHeightInput(event.target.value);
  };

  // Update the actual graphHeight and localStorage on blur
  const handleGraphHeightBlur = (event) => {
    const { value } = event.target;
    setGraphHeight(value);
    localStorage.setItem(STORAGE_KEYS.GRAPH_HEIGHT, value);
  };

  const updateShowLegend = () => {
    const value = !showLegend;
    setShowLegend(value);
    localStorage.setItem(STORAGE_KEYS.SHOW_LEGEND, JSON.stringify(value));
  };
  const updateYLabelWidth = (event) => {
    setMarginLeft(event.target.value);
  };
  const updateXLabelRotation = (event) => {
    try {
      setXLabelRotation(parseInt(event.target.value, 10));
    } catch (error) {
      console.error(`[Heatmap] updateXLabelRotation: ${error}`);
    }
  };
  const updateYLabelAlign = (event) => {
    setYLabelAlign(event.target.value);
  };
  const updateColorPalette = (event) => {
    const { value } = event.target;
    setColorPalette(value);
    localStorage.setItem(STORAGE_KEYS.COLOR_PALETTE, value);
  };
  const updateBgColor = (event) => {
    setBgColor(event.target.value);
  };
  const updateShowDescMax = (event) => {
    setShowDescMax(event.target.value);
  };
  const updateShowMissingData = () => {
    setShowMissingData(!showMissingData);
  };
  const updateShowHomologs = () => {
    setShowHomologs(!showHomologs);
    getHomologsData();
  };
  const updateShowSettings = () => {
    setShowSettings(!showSettings);
  };
  const updateUseAdaptiveScale = () => {
    const value = !useAdaptiveScale;
    setUseAdaptiveScale(value);
    localStorage.setItem(STORAGE_KEYS.USE_ADAPTIVE_SCALE, JSON.stringify(value));
  };
  const updateRowOrdering = (event) => {
    const { value } = event.target;
    setRowOrdering(value);
    localStorage.setItem(STORAGE_KEYS.ROW_ORDERING, value);
  };
  const updateRowAggFn = (event) => {
    const { value } = event.target;
    setRowAggFn(value);
    localStorage.setItem(STORAGE_KEYS.ROW_AGG_FN, value);
    // Apply immediately: passive effects can miss the expand hand-off when only rowAggFn changes.
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

  // DEBUG: remove console log in prod
  // console.log(`[Heatmap] yTerms:\n${JSON.stringify(yTerms, null, 2)}`);
  // console.log(`[Heatmap] data:\n${JSON.stringify(data)}`);

  // Factor out the dimension calculation logic
  const calculateDimensions = (terms, currentMarginLeft) => {
    function countVisibleTerms(items) {
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

      items.forEach(traverse);
      return { count, maxLabelLength };
    }

    const { count: numVisibleTerms, maxLabelLength } = countVisibleTerms(terms);
    const flexHeight = Math.max(
      numVisibleTerms * ROW_HEIGHT_PX + COLOR_LEGEND_HEIGHT + EXTRA_VERTICAL_SPACE_PX,
      MIN_GRAPH_HEIGHT_PX
    );
    const flexMarginLeft = Math.max(maxLabelLength * 7.5 + 50, currentMarginLeft);
    const flexWidth = Math.max(flexMarginLeft + 50, width);

    return { flexHeight, flexMarginLeft, flexWidth };
  };

  // Update useEffect to use the shared function
  useEffect(() => {
    const { flexHeight, flexMarginLeft, flexWidth } = calculateDimensions(yTerms, marginLeft);
    setGraphHeight(flexHeight);
    setGraphWidth(flexWidth);
    setMarginLeft(flexMarginLeft);
  }, [yTerms]);

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

  // Memoize the filtered values and color scale
  const colorScale = useMemo(() => {
    const visibleValues = data
      .filter((d) => visibleTermIds.has(d.y))
      .map((d) => d.value)
      .filter((d) => d !== null);

    const maxValue = useAdaptiveScale ? Math.max(...visibleValues, 0) : 100;

    return d3
      .scaleLinear()
      .domain(THRESHOLDS.map((t) => t * maxValue))
      .range(COLORS[colorPalette]);
  }, [data, visibleTermIds, useAdaptiveScale, colorPalette]);

  const displayData = useMemo(() => (data?.length ? [...data].sort((a, b) => a.y.localeCompare(b.y)) : data), [data]);

  /** Winner ids per root + stable key (includes rowAggFn) so we re-run sync when aggregation changes the pick. */
  const topLevelAutoExpandWinners = useMemo(() => {
    if (!autoExpandMostExpressed || !data?.length || !yTerms?.length) {
      return { key: null, winnerIds: null };
    }
    const scoreMap = computeTermAggregates(data, rowAggFn);
    const winnerIds = yTerms.map((root) => pickWinnerChildIdForRoot(root, scoreMap));
    const key = `${rowAggFn}::${winnerIds.map((id) => (id == null ? '∅' : String(id))).join('|')}`;
    return { key, winnerIds };
  }, [autoExpandMostExpressed, data, rowAggFn, yTerms]);

  const syncTopLevelAutoExpandRef = useRef(onSyncTopLevelAutoExpand);
  syncTopLevelAutoExpandRef.current = onSyncTopLevelAutoExpand;
  const lastAutoExpandSyncKeyRef = useRef(null);

  // Run in layout phase so expand/collapse runs before paint; key includes rowAggFn so aggregation changes always re-sync.
  useLayoutEffect(() => {
    if (isLoading || isInitializingFromUrl) return;
    if (topLevelAutoExpandWinners.key === null || !topLevelAutoExpandWinners.winnerIds) return;
    if (lastAutoExpandSyncKeyRef.current === topLevelAutoExpandWinners.key) return;
    const sync = syncTopLevelAutoExpandRef.current;
    if (!sync) return;
    sync(topLevelAutoExpandWinners.winnerIds);
    lastAutoExpandSyncKeyRef.current = topLevelAutoExpandWinners.key;
  }, [isLoading, isInitializingFromUrl, topLevelAutoExpandWinners]);

  useEffect(() => {
    if (!autoExpandMostExpressed) {
      lastAutoExpandSyncKeyRef.current = null;
    }
  }, [autoExpandMostExpressed]);

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

  const svgRef = useRef();
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
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Convert canvas to PNG and trigger download
      canvas.toBlob((blob) => {
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

  // Update resetToDefaults to use the shared function
  const resetToDefaults = () => {
    const { flexHeight, flexMarginLeft, flexWidth } = calculateDimensions(yTerms, 200);

    // Reset all settings to their default values
    setGraphWidth(flexWidth);
    setGraphHeight(flexHeight);
    setShowLegend(true);
    setMarginLeft(flexMarginLeft);
    setXLabelRotation(340);
    setYLabelAlign(yLabelJustify);
    setColorPalette('viridis');
    setBgColor(backgroundColor);
    setShowDescMax('none');
    setShowMissingData(true);
    setUseAdaptiveScale(false);
    setRowOrdering('alphabetical');
    setRowAggFn('mean');
    setAutoExpandMostExpressed(true);

    // Clear all stored settings
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  // Reset clickedCell when isLoading changes to true
  useEffect(() => {
    if (isLoading) {
      setClickedCell(null);
    }
  }, [isLoading]);

  // Update useEffect to sync input values when graphWidth/graphHeight change
  useEffect(() => {
    setGraphWidthInput(maxGraphWidth);
    setGraphHeightInput(graphHeight);
  }, [graphWidth, graphHeight]);

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
            xTerms={xTerms}
            drilldown={yTerms}
            termProps={termProps}
            hoveredCell={hoveredCell}
            setHoveredCell={setHoveredCell}
            setClickedCell={setClickedCell}
            onToggleExpandCollapse={onToggleExpandCollapse}
            colorScale={colorScale}
            marginLeft={marginLeft}
            xLabelRotation={xLabelRotation}
            yLabelJustify={yLabelAlign}
            showLegend={showLegend}
            showMissingData={showMissingData}
            showDescMax={showDescMax}
            colorLegendWidth={200}
            colorLegendHeight={COLOR_LEGEND_HEIGHT}
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
              width={400}
              style={{
                position: 'sticky',
                top: '1rem',
              }}
              onClose={() => setClickedCell(null)}
            />
          </div>
        )}
      </div>

      {/* Move download and settings cards after the main content */}
      <div className="mt-4">
        {/* Existing download card */}
        <div className="card mb-4" style={{ position: 'relative', zIndex: 1 }}>
          <header className="card-header">
            <div className="card-header-title is-flex is-align-items-center">
              <span>Download</span>
              <span style={{ marginLeft: '10px' }} />
              <div className="is-flex is-justify-content-flex-end">
                <Bulma.Button
                  className="download-btn is-small mr-2"
                  onClick={downloadPng}
                  renderAs="a"
                  target="_blank"
                  rel="noreferrer"
                >
                  PNG
                  <span className="icon is-small ml-1">
                    <Download size={15} />
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
                    <Download size={15} />
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
                    <Download size={15} />
                  </span>
                </Bulma.Button>
              </div>
            </div>
          </header>
        </div>

        {/* Existing settings card */}
        <div className="card" style={{ position: 'relative', zIndex: 1 }}>
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
                              size="10"
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
                              size="10"
                              value={graphHeightInput}
                              onChange={handleGraphHeightChange}
                              onBlur={handleGraphHeightBlur}
                            />
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
                            <input type="text" size="10" value={marginLeft} onChange={updateYLabelWidth} />
                          </td>
                        </tr>
                        {SHOW_DEBUG_OPTIONS ? (
                          <tr>
                            <td>X label rotation:</td>
                            <td>
                              <input type="text" size="10" value={xLabelRotation} onChange={updateXLabelRotation} />
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
                          <td>adaptive color scale:</td>
                          <td>
                            <input type="checkbox" checked={useAdaptiveScale} onChange={updateUseAdaptiveScale} />
                          </td>
                        </tr>
                        <tr>
                          <td>background color:</td>
                          <td>
                            <input type="text" size="10" value={bgColor} onChange={updateBgColor} />
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
                            <>
                              <tr>
                                <td>Show missing data:</td>
                                <td>
                                  <input type="checkbox" checked={showMissingData} onChange={updateShowMissingData} />
                                </td>
                              </tr>
                              <tr>
                                <td>Show homologs:</td>
                                <td>
                                  <input type="checkbox" checked={showHomologs} onChange={updateShowHomologs} />
                                </td>
                              </tr>
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
                            </>
                          ) : null}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    <Bulma.Button className="is-warning is-light is-outlined" onClick={resetToDefaults}>
                      Reset to defaults
                    </Bulma.Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
