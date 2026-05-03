import type * as React from 'react';

export type RendererProps = {
  width: number;
  height: number;
  backgroundColor?: string;
  data: unknown;
  drilldown: unknown;
  termProps: unknown;
  hoveredCell: unknown;
  setHoveredCell: React.Dispatch<React.SetStateAction<any>>;
  setClickedCell: React.Dispatch<React.SetStateAction<any>>;
  onToggleExpandCollapse: (...args: any[]) => void;
  colorScale: unknown;
  marginLeft: number;
  xLabelRotation: number;
  yLabelJustify: string;
  showLegend: boolean;
  showMissingData: boolean;
  showDescMax: boolean;
  colorLegendWidth: number;
  colorLegendHeight: number;
  maxCellWidth: number;
  minCellWidth?: number;
  minCellHeight?: number;
  maxGraphWidth?: number;
  setGraphWidth: React.Dispatch<React.SetStateAction<any>>;
  rowOrdering: string;
  rowAggFn: string;
  getChildData?: unknown;
  yTerms?: unknown;
  xTerms?: unknown;
  clickedCell?: unknown;
};

export declare const Renderer: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<RendererProps> & React.RefAttributes<SVGSVGElement>
>;
