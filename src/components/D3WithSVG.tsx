import React from "react";
import { extent } from "d3";
import { NumberValue, scaleLinear } from "d3-scale";

import { ChartProps, Dot } from "../types";
import AxisLeft from "./AxisLeft";
import AxisBottom from "./AxisBottom";

const D3WithSVG: React.FC<ChartProps> = ({
  data,
  selectedClusters,
  markerY,
  markerX,
  clusterColors,
}) => {
  const w = 300;
  const h = 300;
  const margin = 40;
  const width = w - margin * 2;
  const height = h - margin * 2;

  let dots: Array<Dot> = [];

  for (let key in data) {
    if (selectedClusters.includes(key)) {
      dots.push(
        ...data[key].map((d) => ({
          x: d[markerX] as number,
          y: d[markerY] as number,
          color: clusterColors[key],
        }))
      );
    }
  }

  const xScale = scaleLinear()
    .domain(extent(dots, (d) => d.x) as NumberValue[])
    .range([0, width]);
  const yScale = scaleLinear()
    .domain(extent(dots, (d) => d.y) as NumberValue[])
    .range([height, 0]);

  let circles = dots.map((d, i) => (
    <circle
      key={`${d}-${i}`}
      r={1}
      cx={xScale(d.x)}
      cy={yScale(d.y)}
      fill={d.color}
    ></circle>
  ));

  return (
    <svg width={w} height={h}>
      <g transform={`translate(${margin}, ${margin})`}>
        {circles}
        <AxisLeft yScale={yScale} width={width} />
        <AxisBottom xScale={xScale} height={height} />
      </g>
    </svg>
  );
};

export default D3WithSVG;
