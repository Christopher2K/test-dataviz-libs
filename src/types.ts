export type PlotType = "d3svg" | "d3canvas" | "highchart" | "sunburst";
export const plotTitle: Record<PlotType, string> = {
  d3svg: "D3 avec SVG",
  d3canvas: "D3 avec Canvas",
  highchart: "High Chart",
  sunburst: "Sunburst Chart",
};

export type SunburstCluster = {
  [name: string]: {
    label: string;
    is_hidden: boolean;
    count: number;
    children: SunburstCluster;
  };
};

export type Cluster = string;
export type Marker = string;
export type Data = {
  [cluster: string]: Array<Record<Marker, number>>;
};

export type ChartProps = {
  data: Data;
  selectedClusters: Array<Cluster>;
  markerX: Marker;
  markerY: Marker;
  clusterColors: Record<Cluster, string>;
};

export type Dot = { color: string; x: number; y: number };
