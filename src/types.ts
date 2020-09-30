import { NumberValue } from "d3";

export type PlotType = "d3svg" | "d3canvas" | "highchart";
export const plotTitle: Record<PlotType, string> = {
  d3svg: "D3 avec SVG",
  d3canvas: "D3 avec Canvas",
  highchart: "High Chart",
};

export type Dot = {
  x: number;
  y: number;
};

export type DotData = {
  color: string;
  data: Array<Dot>;
};

export type ChartProps = {
  rawData: Array<DotData>;
  numberOfGroups: number;
  xExtent: NumberValue[];
  yExtent: NumberValue[];
};
