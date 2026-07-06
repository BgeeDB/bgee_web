import React from 'react';
import { Minus, Plus, Maximize2 } from 'lucide-react';
import { useLocation } from 'react-router';

import Bulma from '~/components/Bulma';

const DEFAULT_SVG_SIZE = { width: 3780, height: 1872 };
const ZOOM_FACTOR = 1.2;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const DRAG_THRESHOLD_PX = 4;
const MAX_VIEWPORT_HEIGHT_PX = 1200;

type Point = { x: number; y: number };
type HitProbeResult = {
  method: string;
  x: number;
  y: number;
  tag: string | null;
  href: string | null;
};

type SpeciesAnatomyHeatmapProps = {
  src: string;
  title: string;
};

const clampZoom = (value: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

const clampPan = (pan: Point, viewport: HTMLElement, contentWidth: number, contentHeight: number): Point => {
  const minX = Math.min(0, viewport.clientWidth - contentWidth);
  const minY = Math.min(0, viewport.clientHeight - contentHeight);

  return {
    x: Math.min(0, Math.max(minX, pan.x)),
    y: Math.min(0, Math.max(minY, pan.y)),
  };
};

const prepareInlineSvg = (svg: SVGSVGElement) => {
  const parsedWidth = Number.parseFloat(svg.getAttribute('width') || '');
  const parsedHeight = Number.parseFloat(svg.getAttribute('height') || '');

  svg.removeAttribute('width');
  svg.removeAttribute('height');

  const viewBox = svg.viewBox?.baseVal;
  if (!viewBox?.width || !viewBox?.height) {
    const width = Number.isFinite(parsedWidth) && parsedWidth > 0 ? parsedWidth : DEFAULT_SVG_SIZE.width;
    const height = Number.isFinite(parsedHeight) && parsedHeight > 0 ? parsedHeight : DEFAULT_SVG_SIZE.height;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');

  svg.querySelectorAll('a').forEach((anchor) => {
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
  });

  const box = svg.viewBox.baseVal;
  return { width: box.width, height: box.height };
};

const SpeciesAnatomyHeatmap = ({ src, title }: SpeciesAnatomyHeatmapProps) => {
  const location = useLocation();
  const debugEnabled = React.useMemo(
    () => new URLSearchParams(location.search).has('heatmapDebug'),
    [location.search]
  );

  const viewportRef = React.useRef<HTMLDivElement>(null);
  const svgHostRef = React.useRef<HTMLDivElement>(null);
  const pinchRef = React.useRef<{ distance: number; zoom: number } | null>(null);
  const zoomRef = React.useRef(1);
  const panRef = React.useRef<Point>({ x: 0, y: 0 });
  const svgSizeRef = React.useRef(DEFAULT_SVG_SIZE);
  const dragRef = React.useRef<{
    pointerId: number;
    startClient: Point;
    startPan: Point;
    moved: boolean;
  } | null>(null);

  const [svgHtml, setSvgHtml] = React.useState<string | null>(null);
  const [svgLoadError, setSvgLoadError] = React.useState<string | null>(null);
  const [svgSize, setSvgSize] = React.useState(DEFAULT_SVG_SIZE);
  const [fitScale, setFitScale] = React.useState(1);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [debugMarker, setDebugMarker] = React.useState<Point | null>(null);
  const [debugProbes, setDebugProbes] = React.useState<HitProbeResult[]>([]);

  const scale = fitScale * zoom;
  const contentWidth = svgSize.width * scale;
  const contentHeight = svgSize.height * scale;

  zoomRef.current = zoom;
  panRef.current = pan;
  svgSizeRef.current = svgSize;

  const metricsRef = React.useRef({ contentWidth, contentHeight });
  metricsRef.current = { contentWidth, contentHeight };

  const setPanClamped = React.useCallback((next: Point | ((current: Point) => Point)) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const { contentWidth: width, contentHeight: height } = metricsRef.current;
    setPan((current) => {
      const resolved = typeof next === 'function' ? next(current) : next;
      return clampPan(resolved, viewport, width, height);
    });
  }, []);

  const updateFitScale = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const availableWidth = viewport.clientWidth;
    const svgWidth = svgSizeRef.current.width;
    if (availableWidth <= 0 || svgWidth <= 0) return;
    setFitScale(availableWidth / svgWidth);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    setSvgHtml(null);
    setSvgLoadError(null);

    fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((html) => {
        if (cancelled) return;

        const doc = new DOMParser().parseFromString(html, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (!svg) {
          setSvgLoadError('Invalid SVG document');
          return;
        }

        const size = prepareInlineSvg(svg);
        setSvgSize(size);
        setSvgHtml(svg.outerHTML);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setSvgLoadError(error instanceof Error ? error.message : 'Failed to load heatmap');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  React.useLayoutEffect(() => {
    if (!svgHtml) return;
    updateFitScale();
    setPanClamped((current) => current);
  }, [svgHtml, svgSize, updateFitScale, setPanClamped]);

  React.useEffect(() => {
    updateFitScale();
    const viewport = viewportRef.current;
    if (!viewport || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(() => {
      updateFitScale();
      setPanClamped((current) => current);
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [updateFitScale, setPanClamped]);

  React.useEffect(() => {
    setPanClamped((current) => current);
  }, [contentWidth, contentHeight, setPanClamped]);

  const probeHitMethods = React.useCallback((clientX: number, clientY: number): HitProbeResult[] => {
    const host = svgHostRef.current;
    const svg = host?.querySelector('svg');
    if (!host || !svg) return [];

    const hostRect = host.getBoundingClientRect();
    if (hostRect.width <= 0 || hostRect.height <= 0) return [];

    const localX = clientX - hostRect.left;
    const localY = clientY - hostRect.top;
    const { width: vbWidth, height: vbHeight } = svgSizeRef.current;

    const describe = (method: string, x: number, y: number, element: Element | null): HitProbeResult => {
      const anchor = element?.closest('a') ?? null;
      const href =
        anchor?.getAttribute('href') ?? anchor?.getAttributeNS('http://www.w3.org/1999/xlink', 'href') ?? null;
      return {
        method,
        x: Math.round(x),
        y: Math.round(y),
        tag: element?.tagName?.toLowerCase() ?? null,
        href,
      };
    };

    const probes: HitProbeResult[] = [];

    probes.push(describe('document @ client', clientX, clientY, document.elementFromPoint(clientX, clientY)));

    probes.push(describe('host-local px', localX, localY, document.elementFromPoint(
      hostRect.left + localX,
      hostRect.top + localY
    )));

    const viewBoxX = (localX / hostRect.width) * vbWidth;
    const viewBoxY = (localY / hostRect.height) * vbHeight;
    const svgDoc = svg.ownerDocument;
    if (svgDoc) {
      probes.push(describe('viewBox', viewBoxX, viewBoxY, svgDoc.elementFromPoint(viewBoxX, viewBoxY)));
    }

    if (typeof svg.createSVGPoint === 'function') {
      const ctm = svg.getScreenCTM();
      if (ctm && svgDoc) {
        const point = svg.createSVGPoint();
        point.x = clientX;
        point.y = clientY;
        const { x, y } = point.matrixTransform(ctm.inverse());
        probes.push(describe('getScreenCTM⁻¹', x, y, svgDoc.elementFromPoint(x, y)));
      }
    }

    return probes;
  }, []);

  const runDebugProbe = React.useCallback(
    (clientX: number, clientY: number) => {
      setDebugMarker({ x: clientX, y: clientY });
      setDebugProbes(probeHitMethods(clientX, clientY));
    },
    [probeHitMethods]
  );

  const zoomIn = () => setZoom((current) => clampZoom(current * ZOOM_FACTOR));
  const zoomOut = () => setZoom((current) => clampZoom(current / ZOOM_FACTOR));
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const applyWheelZoom = (deltaY: number) => {
      if (deltaY < 0) {
        setZoom((current) => clampZoom(current * ZOOM_FACTOR));
      } else if (deltaY > 0) {
        setZoom((current) => clampZoom(current / ZOOM_FACTOR));
      }
    };

    const endDrag = (event: PointerEvent) => {
      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
      dragRef.current = null;
      setIsDragging(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      dragRef.current = {
        pointerId: event.pointerId,
        startClient: { x: event.clientX, y: event.clientY },
        startPan: { ...panRef.current },
        moved: false,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;

      if (drag && drag.pointerId === event.pointerId) {
        const deltaX = event.clientX - drag.startClient.x;
        const deltaY = event.clientY - drag.startClient.y;

        if (!drag.moved) {
          if (Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD_PX) {
            if (debugEnabled) runDebugProbe(event.clientX, event.clientY);
            return;
          }
          drag.moved = true;
          setIsDragging(true);
          viewport.setPointerCapture(event.pointerId);
        }

        event.preventDefault();
        setPanClamped({
          x: drag.startPan.x + deltaX,
          y: drag.startPan.y + deltaY,
        });
        return;
      }

      if (debugEnabled) runDebugProbe(event.clientX, event.clientY);
    };

    const onPointerUp = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      if (drag.moved) {
        event.preventDefault();
      } else if (debugEnabled) {
        runDebugProbe(event.clientX, event.clientY);
      }

      endDrag(event);
    };

    const onPointerCancel = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      endDrag(event);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      applyWheelZoom(event.deltaY);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) {
        pinchRef.current = null;
        return;
      }
      const [a, b] = [event.touches[0], event.touches[1]];
      pinchRef.current = {
        distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        zoom: zoomRef.current,
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 2 || !pinchRef.current) return;
      event.preventDefault();
      const [a, b] = [event.touches[0], event.touches[1]];
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const ratio = distance / pinchRef.current.distance;
      setZoom(clampZoom(pinchRef.current.zoom * ratio));
    };

    const onTouchEnd = () => {
      pinchRef.current = null;
    };

    viewport.addEventListener('pointerdown', onPointerDown, true);
    viewport.addEventListener('pointermove', onPointerMove, true);
    viewport.addEventListener('pointerup', onPointerUp, true);
    viewport.addEventListener('pointercancel', onPointerCancel, true);
    viewport.addEventListener('wheel', onWheel, { passive: false });
    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', onTouchEnd, { passive: true });
    viewport.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown, true);
      viewport.removeEventListener('pointermove', onPointerMove, true);
      viewport.removeEventListener('pointerup', onPointerUp, true);
      viewport.removeEventListener('pointercancel', onPointerCancel, true);
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', onTouchEnd);
      viewport.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [debugEnabled, runDebugProbe, setPanClamped]);

  const zoomPercent = Math.round(zoom * 100);
  const viewportHeight = Math.min(contentHeight, MAX_VIEWPORT_HEIGHT_PX);

  const viewportClassName = [
    'species-anatomy-heatmap__viewport',
    isDragging ? 'species-anatomy-heatmap__viewport--dragging' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="species-anatomy-heatmap">
      <div className="species-anatomy-heatmap__toolbar" role="toolbar" aria-label="Heatmap zoom controls">
        <Bulma.Button
          type="button"
          size="small"
          outlined
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
        >
          <Minus size={16} aria-hidden />
        </Bulma.Button>
        <span className="species-anatomy-heatmap__zoom-label" aria-live="polite">
          {zoomPercent}%
        </span>
        <Bulma.Button type="button" size="small" outlined onClick={zoomIn} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in">
          <Plus size={16} aria-hidden />
        </Bulma.Button>
        <Bulma.Button type="button" size="small" outlined onClick={resetView} aria-label="Reset zoom and pan">
          <Maximize2 size={16} aria-hidden />
          <span className="species-anatomy-heatmap__reset-label">Fit width</span>
        </Bulma.Button>
        <span className="species-anatomy-heatmap__hint is-size-7 has-text-grey">
          Drag to pan · Pinch or wheel to zoom · Click cells and labels to open links
          {debugEnabled ? ' · Debug mode on' : ''}
        </span>
      </div>

      {debugEnabled && (
        <p className="species-anatomy-heatmap__debug-hint is-size-7 has-text-grey">
          Move the mouse over the heatmap to compare hit-test methods. The red crosshair marks the pointer; the row
          that reports <code>&lt;a&gt;</code> under the cursor is the coordinate system the browser uses here.
        </p>
      )}

      {svgLoadError && <p className="notification is-danger is-light">Could not load heatmap: {svgLoadError}</p>}

      <div ref={viewportRef} className={viewportClassName} style={{ height: viewportHeight }}>
        <div
          className="species-anatomy-heatmap__stage"
          style={{
            left: pan.x,
            top: pan.y,
            width: contentWidth,
            height: contentHeight,
          }}
        >
          {svgHtml ? (
            <div
              ref={svgHostRef}
              className="species-anatomy-heatmap__svg-host"
              style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
              dangerouslySetInnerHTML={{ __html: svgHtml }}
              aria-label={title}
            />
          ) : (
            !svgLoadError && <p className="species-anatomy-heatmap__loading">Loading heatmap…</p>
          )}
        </div>

        {debugEnabled && debugMarker && (
          <div
            className="species-anatomy-heatmap__debug-marker"
            style={{ left: debugMarker.x, top: debugMarker.y }}
            aria-hidden
          />
        )}
      </div>

      {debugEnabled && debugProbes.length > 0 && (
        <div className="species-anatomy-heatmap__debug-panel content is-size-7">
          <p>
            <strong>Hit-test probe</strong> (zoom {zoomPercent}%, pan {Math.round(pan.x)}, {Math.round(pan.y)}, host{' '}
            {Math.round(contentWidth)}×{Math.round(contentHeight)}px)
          </p>
          <table className="table is-narrow is-fullwidth">
            <thead>
              <tr>
                <th>Method</th>
                <th>x</th>
                <th>y</th>
                <th>Element</th>
                <th>href</th>
              </tr>
            </thead>
            <tbody>
              {debugProbes.map((probe) => (
                <tr key={probe.method}>
                  <td>{probe.method}</td>
                  <td>{probe.x}</td>
                  <td>{probe.y}</td>
                  <td>{probe.tag ?? '—'}</td>
                  <td className="species-anatomy-heatmap__debug-href">{probe.href ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SpeciesAnatomyHeatmap;
