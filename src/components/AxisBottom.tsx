import React from "react";
import { ScaleLinear } from "d3";

type AxisBottomProps = {
  xScale: ScaleLinear<number, number>;
  height: number;
};

const AxisBottom: React.FC<AxisBottomProps> = ({ xScale, height }) => {
  const axis = xScale.ticks(10).map((d, i) => (
    <g className="x-tick" key={i}>
      <line
        style={{ stroke: "#e4e5eb" }}
        y1={0}
        y2={height}
        x1={xScale(d)}
        x2={xScale(d)}
      />
      <text
        style={{ textAnchor: "middle", fontSize: 12 }}
        dy=".71em"
        x={xScale(d)}
        y={height + 10}
      >
        {d}
      </text>
    </g>
  ));
  return <>{axis}</>;
};

export default AxisBottom;
