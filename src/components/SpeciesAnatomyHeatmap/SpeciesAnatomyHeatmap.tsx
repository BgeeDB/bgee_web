import React from 'react';
import { Minus, Plus, Maximize2 } from 'lucide-react';

import Bulma from '~/components/Bulma';

const DEFAULT_SVG_SIZE = { width: 3780, height: 1872 };
const ZOOM_FACTOR = 1.2;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const DRAG_THRESHOLD_PX = 4;
const MAX_VIEWPORT_HEIGHT_PX = 1200;
const XLINK_NS = 'http://www.w3.org/1999/xlink';

type Point = { x: number; y: number };
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

const getSvgAnchorHref = (anchor: Element): string | null => {
  const href = anchor.getAttribute('href') ?? anchor.getAttributeNS(XLINK_NS, 'href');
  if (href) return href;

  const svgAnchor = anchor as SVGAElement;
  if (svgAnchor.href?.baseVal) return svgAnchor.href.baseVal;

  return null;
};

const SpeciesAnatomyHeatmap = ({ src, title }: SpeciesAnatomyHeatmapProps) => {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const objectRef = React.useRef<HTMLObjectElement>(null);
  const panLayerRef = React.useRef<HTMLDivElement>(null);
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

  const [svgSize, setSvgSize] = React.useState(DEFAULT_SVG_SIZE);
  const [fitScale, setFitScale] = React.useState(1);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [isOverLink, setIsOverLink] = React.useState(false);

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
    if (availableWidth <= 0) return;
    setFitScale(availableWidth / svgSize.width);
  }, [svgSize.width]);

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

  const onObjectLoad = () => {
    const svg = objectRef.current?.contentDocument?.querySelector('svg');
    if (!svg) return;

    const viewBox = svg.viewBox?.baseVal;
    if (viewBox?.width > 0 && viewBox?.height > 0) {
      setSvgSize({ width: viewBox.width, height: viewBox.height });
    }
  };

  const getLinkHrefAt = React.useCallback((clientX: number, clientY: number): string | null => {
    const object = objectRef.current;
    const doc = object?.contentDocument;
    const svg = doc?.querySelector('svg');
    if (!object || !doc || !svg) return null;

    let anchor: Element | null = null;

    // Map screen coordinates into SVG user space (stable across zoom and pan)
    if (typeof svg.createSVGPoint === 'function') {
      const ctm = svg.getScreenCTM();
      if (ctm) {
        const point = svg.createSVGPoint();
        point.x = clientX;
        point.y = clientY;
        const { x, y } = point.matrixTransform(ctm.inverse());
        anchor = doc.elementFromPoint(x, y)?.closest('a') ?? null;
      }
    }

    // Fallback: coordinates in the object's rendered pixel space
    if (!anchor) {
      const objectRect = object.getBoundingClientRect();
      if (objectRect.width <= 0 || objectRect.height <= 0) return null;
      anchor = doc.elementFromPoint(clientX - objectRect.left, clientY - objectRect.top)?.closest('a') ?? null;
    }

    return anchor ? getSvgAnchorHref(anchor) : null;
  }, []);

  const updateLinkHover = React.useCallback(
    (clientX: number, clientY: number) => {
      setIsOverLink(getLinkHrefAt(clientX, clientY) !== null);
    },
    [getLinkHrefAt]
  );

  const openLinkAt = (clientX: number, clientY: number) => {
    const href = getLinkHrefAt(clientX, clientY);
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const zoomIn = () => setZoom((current) => clampZoom(current * ZOOM_FACTOR));
  const zoomOut = () => setZoom((current) => clampZoom(current / ZOOM_FACTOR));
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const endDrag = (pointerId: number) => {
    const panLayer = panLayerRef.current;
    if (panLayer?.hasPointerCapture(pointerId)) {
      panLayer.releasePointerCapture(pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startClient: { x: event.clientX, y: event.clientY },
      startPan: { ...panRef.current },
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (drag && drag.pointerId === event.pointerId) {
      const deltaX = event.clientX - drag.startClient.x;
      const deltaY = event.clientY - drag.startClient.y;

      if (!drag.moved && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD_PX) {
        updateLinkHover(event.clientX, event.clientY);
        return;
      }

      drag.moved = true;
      if (!isDragging) setIsDragging(true);

      event.preventDefault();
      setPanClamped({
        x: drag.startPan.x + deltaX,
        y: drag.startPan.y + deltaY,
      });
      return;
    }

    updateLinkHover(event.clientX, event.clientY);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (drag.moved) {
      event.preventDefault();
    } else {
      openLinkAt(event.clientX, event.clientY);
    }

    endDrag(event.pointerId);
    updateLinkHover(event.clientX, event.clientY);
  };

  const onPointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    endDrag(event.pointerId);
    setIsOverLink(false);
  };

  const onPointerLeave = () => {
    if (!isDragging) {
      setIsOverLink(false);
    }
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

    viewport.addEventListener('wheel', onWheel, { passive: false });
    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', onTouchEnd, { passive: true });
    viewport.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', onTouchEnd);
      viewport.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  const zoomPercent = Math.round(zoom * 100);
  const viewportHeight = Math.min(contentHeight, MAX_VIEWPORT_HEIGHT_PX);

  const panLayerClassName = [
    'species-anatomy-heatmap__pan-layer',
    isDragging ? 'species-anatomy-heatmap__pan-layer--dragging' : '',
    !isDragging && isOverLink ? 'species-anatomy-heatmap__pan-layer--over-link' : '',
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
        </span>
      </div>

      <div ref={viewportRef} className="species-anatomy-heatmap__viewport" style={{ height: viewportHeight }}>
        <div
          className="species-anatomy-heatmap__stage"
          style={{
            left: pan.x,
            top: pan.y,
            width: contentWidth,
            height: contentHeight,
          }}
        >
          <object
            ref={objectRef}
            type="image/svg+xml"
            data={src}
            title={title}
            aria-label={title}
            width={contentWidth}
            height={contentHeight}
            onLoad={onObjectLoad}
          >
            <p>
              Your browser cannot display this SVG.{' '}
              <a href={src} target="_blank" rel="noopener noreferrer">
                Open the heatmap image
              </a>
              .
            </p>
          </object>
        </div>
        <div
          ref={panLayerRef}
          className={panLayerClassName}
          aria-hidden
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onPointerLeave={onPointerLeave}
        />
      </div>
    </div>
  );
};

export default SpeciesAnatomyHeatmap;