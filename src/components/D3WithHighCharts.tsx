import React from "react";
// import * as Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";

import { ChartProps } from "../types";

const D3WithHighCharts: React.FC<ChartProps> = () => {
  // const slicedData = rawData.slice(0, numberOfGroups);
  // const options: Highcharts.Options = {
  //   title: {
  //     text: "Highchart test",
  //   },
  //   chart: {
  //     type: "scatter",
  //     animation: false,
  //     width: 300,
  //     height: 300,
  //   },
  //   tooltip: {
  //     enabled: false,
  //   },
  //   xAxis: {
  //     min: Math.min(...(xExtent as number[])),
  //     max: Math.max(...(xExtent as number[])),
  //   },
  //   yAxis: {
  //     min: Math.min(...(yExtent as number[])),
  //     max: Math.max(...(yExtent as number[])),
  //   },
  //   plotOptions: {
  //     scatter: {
  //       animation: false,
  //       states: {
  //         hover: { enabled: false },
  //       },
  //     },
  //   },
  //   boost: {
  //     enabled: true,
  //     useGPUTranslations: true,
  //     usePreallocated: true,
  //   },
  //   series: slicedData.map((dotData, i) => {
  //     return {
  //       name: `Data ${i}`,
  //       color: dotData.color,
  //       data: dotData.data.map((dot) => [dot.x, dot.y]),
  //       type: "scatter",
  //     };
  //   }),
  // };
  // return <HighchartsReact highcharts={Highcharts} options={options} />;
  return null;
};

export default D3WithHighCharts;
