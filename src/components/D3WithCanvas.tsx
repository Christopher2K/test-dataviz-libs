import React from "react";
// import React, { useEffect, useRef } from "react";
// import { scaleLinear } from "d3-scale";

import { ChartProps } from "../types";

const D3WithCanvas: React.FC<ChartProps> = () => {
  // const w = 300;
  // const h = 300;

  // const canvasRef = useRef<HTMLCanvasElement>(null);

  // const slicedData = rawData.slice(0, numberOfGroups);

  // const xScale = scaleLinear().domain(xExtent).range([0, w]);
  // const yScale = scaleLinear().domain(yExtent).range([h, 0]);

  // useEffect(() => {
  //   if (canvasRef.current) {
  //     const ctx = canvasRef.current.getContext("2d");
  //     if (ctx != null) {
  //       ctx.fillStyle = "#fff";
  //       ctx.fillRect(0, 0, w, h);
  //       for (const dotsData of slicedData) {
  //         for (const d of dotsData.data) {
  //           ctx.fillStyle = dotsData.color;
  //           ctx.beginPath();
  //           ctx.arc(
  //             xScale(d.x) as number,
  //             yScale(d.y) as number,
  //             2,
  //             0,
  //             Math.PI * 2
  //           );
  //           ctx.stroke();
  //           ctx.fill();
  //         }
  //       }
  //     }
  //   }
  // }, [slicedData, xScale, yScale]);

  // return (
  //   <div>
  //     <canvas ref={canvasRef} width={w} height={h}></canvas>
  //   </div>
  // );
  return null;
};

export default D3WithCanvas;
