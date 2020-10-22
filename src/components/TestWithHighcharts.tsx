import React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Boost from "highcharts/modules/boost";
import { extent } from "d3";
import { ChartProps, Dot } from "../types";
Boost(Highcharts);

const TestWithHighcharts: React.FC<ChartProps> = ({
  data,
  selectedClusters,
  markerY,
  markerX,
  clusterColors,
}) => {
  let dotsData: Array<{
    name: string;
    color: string;
    data: Array<Dot>;
  }> = [];

  for (let key in data) {
    if (selectedClusters.includes(key)) {
      dotsData.push({
        color: clusterColors[key],
        name: key,
        data: data[key].map((d) => ({
          x: d[markerX] as number,
          y: d[markerY] as number,
          color: clusterColors[key],
        })),
      });
    }
  }

  const dots = ([] as Array<Dot>).concat(...dotsData.map((d) => d.data));

  const xExtent = extent(dots, (d) => d.x) as number[];
  const yExtent = extent(dots, (d) => d.y) as number[];

  let options: Highcharts.Options = {
    title: {
      text: "Highchart test",
    },
    chart: {
      type: "scatter",
      animation: false,
      width: 300,
      height: 300,
      events: {
        selection: (e: Highcharts.ChartSelectionContextObject) => {
          console.log(e);
          return false;
        },
      },
      zoomType: "xy",
    },
    xAxis: {
      title: {
        text: markerX,
      },
      min: Math.min(...(xExtent as number[])),
      max: Math.max(...(xExtent as number[])),
    },
    yAxis: {
      title: {
        text: markerY,
      },
      min: Math.min(...(yExtent as number[])),
      max: Math.max(...(yExtent as number[])),
    },
    plotOptions: {
      scatter: {
        boostThreshold: 1000,
      },
    },
    series: dotsData.map((d, i) => {
      return {
        name: d.name,
        color: d.color,
        data: d.data.map((dot) => [dot.x, dot.y]),
        type: "scatter",
        marker: {
          radius: 1,
        },
        tooltip: {
          followPointer: false,
          pointFormat: "[{point.x:.1f}, {point.y:.1f}]",
        },
      };
    }),
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TestWithHighcharts;
