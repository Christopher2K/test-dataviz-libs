import React, { ReactElement } from "react";
import { scaleLinear } from "d3-scale";

import { ChartProps } from "../types";
import AxisLeft from "./AxisLeft";
import AxisBottom from "./AxisBottom";

const D3WithSVG: React.FC<ChartProps> = ({
  rawData,
  numberOfGroups,
  xExtent,
  yExtent,
}) => {
  const w = 300;
  const h = 300;
  const margin = 40;
  const width = w - margin * 2;
  const height = h - margin * 2;

  const slicedData = rawData.slice(0, numberOfGroups);

  const xScale = scaleLinear().domain(xExtent).range([0, width]);
  const yScale = scaleLinear().domain(yExtent).range([height, 0]);

  let elements = slicedData.map((dotsData, i) => {
    return dotsData.data.map((d, y) => (
      <circle
        key={`${y}-${i}`}
        r={2}
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        fill={dotsData.color}
      ></circle>
    ));
  });

  let circles: ReactElement[] = [];
  for (let arrayElement of elements) {
    circles = [...circles, ...arrayElement];
  }

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
