import React, { useEffect, useRef, useState, RefObject } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Boost from "highcharts/modules/boost";
import { extent } from "d3";
import { ChartProps, Dot } from "../types";
import { cpus } from "os";
Boost(Highcharts);

type Gate = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const TestWithHighchartsAndGates: React.FC<ChartProps> = ({
  data,
  selectedClusters,
  markerY,
  markerX,
  clusterColors,
}) => {
  const [gate, setGate] = useState<Gate>();
  const chartRef = useRef<{
    chart: Highcharts.Chart;
    container: RefObject<HTMLDivElement>;
  }>(null);

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
      width: 400,
      height: 400,
      events: {
        selection: function (e: Highcharts.ChartSelectionContextObject) {
          const {
            xAxis: [xAxis],
            yAxis: [yAxis],
          } = e;

          const xMin = xAxis.axis.toPixels(xAxis.min, true);
          const xMax = xAxis.axis.toPixels(xAxis.max, true);
          const yMin = yAxis.axis.toPixels(yAxis.min, true);
          const yMax = yAxis.axis.toPixels(yAxis.max, false);

          setGate({
            x: this.plotLeft + xAxis.axis.toPixels(xAxis.min, true),
            y: this.plotTop + yAxis.axis.toPixels(yAxis.max, true),
            width:
              xAxis.axis.toPixels(xAxis.max, true) -
              xAxis.axis.toPixels(xAxis.min, true),
            height:
              yAxis.axis.toPixels(yAxis.min, true) -
              yAxis.axis.toPixels(yAxis.max, true),
          });

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
        // tooltip: {
        //   followPointer: false,
        //   pointFormat: "[{point.x:.1f}, {point.y:.1f}]",
        // },
      };
    }),
    tooltip: { enabled: false },
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (chartRef.current && chartRef.current.chart && gate) {
      chartRef.current.chart.renderer
        .rect()
        .attr({ ...gate })
        .css({
          stroke: "black",
          strokeWidth: ".5",
          fill: "black",
          fillOpacity: ".1",
        })
        .add();
    }
  }, [gate]);

  return (
    <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
  );
};

export default TestWithHighchartsAndGates;
