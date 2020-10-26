import React, { useEffect, useRef, useState, RefObject } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Boost from "highcharts/modules/boost";
import { ChartProps, Dot } from "../types";

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
  const [formattedData, setFormattedData] = useState<
    Highcharts.SeriesScatterOptions[]
  >();
  const [dotsData, setDotsData] = useState<
    Array<{
      name: string;
      color: string;
      data: Array<Dot>;
    }>
  >([]);

  let options: Highcharts.Options = {
    title: {
      text: "Highchart test",
    },
    boost: {
      usePreallocated: true,
      allowForce: true,
      debug: {
        timeSetup: true,
      },
      enabled: true,
      seriesThreshold: 1,
      useGPUTranslations: true,
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

          setGate({
            x: xAxis.axis.toPixels(xAxis.min, false),
            y: yAxis.axis.toPixels(yAxis.max, false),
            width:
              xAxis.axis.toPixels(xAxis.max, false) -
              xAxis.axis.toPixels(xAxis.min, false),
            height:
              yAxis.axis.toPixels(yAxis.min, false) -
              yAxis.axis.toPixels(yAxis.max, false),
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
      startOnTick: false,
      endOnTick: false,
    },
    yAxis: {
      title: {
        text: markerY,
      },
      startOnTick: false,
      endOnTick: false,
    },
    plotOptions: {
      scatter: {
        boostThreshold: 1000,
      },
    },
    series: formattedData,
    tooltip: { enabled: false },
  };

  useEffect(() => {
    if (chartRef.current && chartRef.current.chart && gate) {
      chartRef.current.chart.renderer
        .rect(gate.x, gate.y, gate.width, gate.height, 0, 0.5)
        .css({
          stroke: "black",
          fill: "black",
          fillOpacity: ".1",
        })
        .add();
    }
  }, [gate]);

  useEffect(() => {
    let arr = [];
    for (let key in data) {
      if (selectedClusters.includes(key)) {
        arr.push({
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

    setDotsData(arr);
  }, [clusterColors, data, markerX, markerY, selectedClusters]);

  useEffect(() => {
    setFormattedData(
      dotsData.map((d, i) => {
        return {
          name: d.name,
          color: d.color,
          data: d.data.map((dot) => [dot.x, dot.y]),
          type: "scatter",
          marker: {
            radius: 1,
          },
        };
      })
    );
  }, [dotsData]);

  return (
    <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
  );
};

export default TestWithHighchartsAndGates;
