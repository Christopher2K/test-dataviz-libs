import React, { useEffect, useRef } from "react";
import { extent } from "d3";
import { NumberValue, scaleLinear } from "d3-scale";
import { ChartProps, Dot } from "../types";

const D3WithCanvas: React.FC<ChartProps> = ({
  data,
  selectedClusters,
  markerX,
  markerY,
  clusterColors,
}) => {
  const w = 300;
  const h = 300;

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    .range([0, w]);
  const yScale = scaleLinear()
    .domain(extent(dots, (d) => d.y) as NumberValue[])
    .range([h, 0]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx != null) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        for (const dot of dots) {
          ctx.fillStyle = dot.color;
          ctx.beginPath();
          ctx.arc(
            xScale(dot.x) as number,
            yScale(dot.y) as number,
            1,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.fill();
        }
      }
    }
  }, [dots, xScale, yScale]);

  return (
    <div>
      <canvas ref={canvasRef} width={w} height={h}></canvas>
    </div>
  );
};

export default D3WithCanvas;
