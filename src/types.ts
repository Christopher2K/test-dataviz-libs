export type PlotType = "d3svg" | "d3canvas" | "highchart";
export const plotTitle: Record<PlotType, string> = {
  d3svg: "D3 avec SVG",
  d3canvas: "D3 avec Canvas",
  highchart: "High Chart",
};

export type Cluster = string;
export type Mark = string;
export type Data = {
  [cluster: string]: Array<Record<Mark, number>>;
};

export type ChartProps = {
  data: Data;
  availableClusters: Array<Cluster>;
};
