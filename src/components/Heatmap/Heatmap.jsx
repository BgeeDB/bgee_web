import { useState, useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import Bulma from '../Bulma';
import { Renderer } from "./Renderer";
import { Tooltip } from "./Tooltip";
import { DetailView } from "./DetailView";
import { COLORS, THRESHOLDS, COLOR_LEGEND_HEIGHT } from "./constants";

const SHOW_DEBUG_OPTIONS = false;

// Add constant for localStorage key
const STORAGE_KEYS = {
  USE_ADAPTIVE_SCALE: 'bgee-heatmap-adaptive-scale',
  GRAPH_WIDTH: 'bgee-heatmap-graph-width',
  GRAPH_HEIGHT: 'bgee-heatmap-graph-height',
  SHOW_LEGEND: 'bgee-heatmap-show-legend',
  MARGIN_LEFT: 'bgee-heatmap-margin-left',
  X_LABEL_ROTATION: 'bgee-heatmap-x-label-rotation',
  Y_LABEL_ALIGN: 'bgee-heatmap-y-label-align',
  COLOR_PALETTE: 'bgee-heatmap-color-palette',
  BACKGROUND_COLOR: 'bgee-heatmap-background-color',
  SHOW_DESC_MAX: 'bgee-heatmap-show-desc-max',
  SHOW_MISSING_DATA: 'bgee-heatmap-show-missing-data',
  SHOW_HOMOLOGS: 'bgee-heatmap-show-homologs',
  SHOW_SETTINGS: 'bgee-heatmap-show-settings'
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

const Heatmap = ({ 
  width, 
  height = 800,
  backgroundColor,
  data,
  getChildData,
  getHomologsData,
  yTerms,
  termProps,
  yLabelJustify = 'right',
  onToggleExpandCollapse,
}) => {
  // COMPONENT STATE
  const [hoveredCell, setHoveredCell] = useState(null);
  const [clickedCell, setClickedCell] = useState(null);
  const [showLegend, setShowLegend] = useState(() => 
    getStoredValue(STORAGE_KEYS.SHOW_LEGEND, true));
  const [xLabelRotation, setXLabelRotation] = useState(() => 
    getStoredValue(STORAGE_KEYS.X_LABEL_ROTATION, 0));
  const [yLabelAlign, setYLabelAlign] = useState(() => 
    getStoredValue(STORAGE_KEYS.Y_LABEL_ALIGN, yLabelJustify));
  const [graphWidth, setGraphWidth] = useState(() => 
    getStoredValue(STORAGE_KEYS.GRAPH_WIDTH, width));
  const [graphHeight, setGraphHeight] = useState(() => 
    getStoredValue(STORAGE_KEYS.GRAPH_HEIGHT, height));
  const [colorPalette, setColorPalette] = useState(() => 
    getStoredValue(STORAGE_KEYS.COLOR_PALETTE, 'viridis'));
  const [bgColor, setBgColor] = useState(() => 
    getStoredValue(STORAGE_KEYS.BACKGROUND_COLOR, backgroundColor));
  const [marginLeft, setMarginLeft] = useState(() => 
    getStoredValue(STORAGE_KEYS.MARGIN_LEFT, 200));
  const [showDescMax, setShowDescMax] = useState(() => 
    getStoredValue(STORAGE_KEYS.SHOW_DESC_MAX, 'none'));
  const [showMissingData, setShowMissingData] = useState(() => 
    getStoredValue(STORAGE_KEYS.SHOW_MISSING_DATA, true));
  const [showHomologs, setShowHomologs] = useState(() => 
    getStoredValue(STORAGE_KEYS.SHOW_HOMOLOGS, false));
  const [showSettings, setShowSettings] = useState(() => 
    getStoredValue(STORAGE_KEYS.SHOW_SETTINGS, false));
  const [useAdaptiveScale, setUseAdaptiveScale] = useState(() => 
    getStoredValue(STORAGE_KEYS.USE_ADAPTIVE_SCALE, false));

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
      .filter(d => visibleTermIds.has(d.y))
      .map(d => d.value)
      .filter(d => d !== null);
    
    const maxValue = useAdaptiveScale ? 
      (Math.max(...visibleValues, 0)) : 
      100;
    
    return d3
      .scaleLinear()
      .domain(THRESHOLDS.map(t => t * maxValue))
      .range(COLORS[colorPalette]);
  }, [data, visibleTermIds, colorPalette, useAdaptiveScale]);

  // handle display property changes
  const updateGraphWidth = ({ target: { value } }) => {
    setGraphWidth(value);
    localStorage.setItem(STORAGE_KEYS.GRAPH_WIDTH, JSON.stringify(value));
  };

  const updateGraphHeight = ({ target: { value } }) => {
    setGraphHeight(value);
    localStorage.setItem(STORAGE_KEYS.GRAPH_HEIGHT, JSON.stringify(value));
  };

  const updateShowLegend = () => {
    const value = !showLegend;
    setShowLegend(value);
    localStorage.setItem(STORAGE_KEYS.SHOW_LEGEND, JSON.stringify(value));
  }

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
  }

  const updateShowHomologs = () => {
    const value = !showHomologs;
    setShowHomologs(value);
    localStorage.setItem(STORAGE_KEYS.SHOW_HOMOLOGS, JSON.stringify(value));
    getHomologsData();
  }

  const updateShowSettings = () => {
    const value = !showSettings;
    setShowSettings(value);
    localStorage.setItem(STORAGE_KEYS.SHOW_SETTINGS, JSON.stringify(value));
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

    const { count: numVisibleTerms, maxLabelLength}  = countVisibleTerms(yTerms);
    // console.log(`[Heatmap] ${numVisibleTerms} visible terms`);
    // console.log(`[Heatmap] yTerms:\n${JSON.stringify(yTerms, null, 2)}`);
    const flexHeight = Math.max(numVisibleTerms * 30 + COLOR_LEGEND_HEIGHT, 250);
    const flexMarginLeft = Math.max(maxLabelLength * 7.5 + 50, marginLeft);
    const flexWidth = Math.max(flexMarginLeft + 50, graphWidth);
    setGraphHeight(flexHeight);
    setGraphWidth(flexWidth);
    setMarginLeft(flexMarginLeft);
  }, [yTerms]);

  // sort entries by y coordinate
  const displayData = data.sort((a, b) => a.y.localeCompare(b.y));

  const downloadTsv = () => {
    if (!data) return;

    // Extract headers from the first object
    const headers = Object.keys(data[0]);

    // Convert headers to a tab-separated string
    const headerString = headers.join("\t");

    // Convert each JSON object to a tab-separated string
    const dataStrings = data.map(obj => (
      headers.map(header => obj[header]).join("\t")
    ));


    // Combine headers and data strings into a single string
    const tsvString = [headerString, ...dataStrings].join("\n");

    
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
            getChildData={getChildData}
            yTerms={yTerms}
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
            yLabelJustify={yLabelAlign}
            showLegend={showLegend}
            showMissingData={showMissingData}
            showDescMax={showDescMax}
            colorLegendWidth={200}
            colorLegendHeight={COLOR_LEGEND_HEIGHT}
          />

          <Tooltip
            interactionData={hoveredCell}
            width={graphWidth}
            height={graphHeight - COLOR_LEGEND_HEIGHT}
          />
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

      <div className="card"
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

      <div className="card"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <header className="card-header">
          <p className="card-header-title">
            Settings
            <span style={{ marginLeft: "10px" }} />
            <a href="#collapsible-settings" data-action="collapse" onClick={updateShowSettings}>
              {showSettings ? "Collapse" : "Expand"}
            </a>
          </p>
        </header>

        <div 
          id="collapsible-settings" 
          className={`is-collapsible ${showSettings ? "is-active" : ""}`}
        >
        {showSettings ? 
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
                          value={graphWidth}
                          onChange={updateGraphWidth}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Graph height:</td>
                      <td>
                        <input 
                          type="text"
                          size="10"
                          value={graphHeight}
                          onChange={updateGraphHeight}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Show Legend:</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={showLegend}
                          onChange={updateShowLegend}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Y label width:</td>
                      <td>
                        <input 
                          type="text"
                          size="10"
                          value={marginLeft}
                          onChange={updateYLabelWidth}
                        />
                      </td>
                    </tr>
                    { SHOW_DEBUG_OPTIONS ? (
                    <tr>
                      <td>X label rotation:</td>
                      <td>
                        <input 
                          type="text"
                          size="10"
                          value={xLabelRotation}
                          onChange={updateXLabelRotation}
                        />
                      </td>
                    </tr>
                    ) : null}
                    { SHOW_DEBUG_OPTIONS ? (
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
                      <input 
                          type="text"
                          size="10"
                          value={bgColor}
                          onChange={updateBgColor}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>adaptive color scale:</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={useAdaptiveScale}
                          onChange={updateUseAdaptiveScale}
                        />
                      </td>
                    </tr>
                  </tbody>
                  </table>
              </div>
              <div className="column">
                { SHOW_DEBUG_OPTIONS ? (
                  <div>
                    <h1>DATA</h1>
                    <table>
                      <tbody>
                        <tr>
                          <td>Show missing data:</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={showMissingData}
                              onChange={updateShowMissingData}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Show homologs:</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={showHomologs}
                              onChange={updateShowHomologs}
                            />
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
                        
                      </tbody>
                    </table>
                  </div>
                ): null
                }
              </div>
            </div>
          </div>
        : null}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;