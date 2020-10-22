import React, { useRef } from "react";
import styled from "@emotion/styled";
import D3WithSVG from "./D3WithSVG";
import D3WithCanvas from "./D3WithCanvas";
import TestWithHighcharts from "./TestWithHighcharts";
import TestWithHighchartsAndGates from "./TestWithHighchartsAndGates";
import ClusterSelection from "./ClusterSelection";
import Sunburst from "./Sunburst";

import * as t from "../types";
import { getRandomColor } from "../utilss";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  background-color: #f2f2f2;
  padding: 20px;
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

const PlotButton = styled.button`
  margin-right: 20px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Playground: React.FC = ({ children }) => {
  const [currentLib, setCurrentLib] = React.useState<t.PlotType>("gating");
  const [data, setData] = React.useState<t.Data>();
  const [availableClusters, setClusters] = React.useState<Array<t.Cluster>>();
  const [availableMarkers, setMarkers] = React.useState<Array<t.Marker>>();
  const [selectedClusters, setClustersSelected] = React.useState<
    Array<t.Cluster>
  >([]);
  const clusterColors = useRef<Record<t.Cluster, string>>({});
  const [numberOfPlots, setNumberOfPlots] = React.useState(1);

  const ChartComponent = (() => {
    switch (currentLib) {
      case "d3svg":
        return D3WithSVG;
      case "d3canvas":
        return D3WithCanvas;
      case "highchart":
        return TestWithHighcharts;
      case "sunburst":
        return Sunburst;
      case "gating":
        return TestWithHighchartsAndGates;
    }
  })();

  React.useEffect(() => {
    if (
      availableClusters != null &&
      Object.keys(clusterColors.current).length === 0
    ) {
      availableClusters.forEach((cluster) => {
        clusterColors.current[cluster] = getRandomColor();
      });
    }
  }, [availableClusters]);

  React.useEffect(() => {
    fetch("/DATA.json")
      .then((resp) => resp.json())
      .then((data) => {
        const clusters = Object.keys(data);
        const markers = Object.keys(data[clusters[0]][0]);
        setData(data);
        setClusters(clusters);
        setMarkers(markers);
      });
  }, []);

  const onCheckboxClicked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;

    if (selectedClusters.includes(value)) {
      setClustersSelected(selectedClusters.filter((c) => c !== value) ?? []);
    } else {
      setClustersSelected([...selectedClusters, value]);
    }
  };

  return (
    <Container>
      <h1>Playground Dataviz #1</h1>
      <TopContainer>
        <PlotButton onClick={() => setCurrentLib("d3svg")}>D3 SVG</PlotButton>
        <PlotButton onClick={() => setCurrentLib("d3canvas")}>
          D3 CANVAS
        </PlotButton>
        <PlotButton onClick={() => setCurrentLib("highchart")}>
          HIGH CHARTS
        </PlotButton>
        <PlotButton onClick={() => setCurrentLib("sunburst")}>
          SUNBURST
        </PlotButton>
        <PlotButton onClick={() => setNumberOfPlots(numberOfPlots + 1)}>
          Ajouter un plot
        </PlotButton>
        <PlotButton onClick={() => setNumberOfPlots(numberOfPlots - 1)}>
          Retirer un plot
        </PlotButton>
      </TopContainer>
      {availableClusters != null && (
        <>
          <p>Clusters disponibles</p>
          <TopContainer>
            {availableClusters.map((c) => (
              <label htmlFor={c} key={c}>
                <input
                  type="checkbox"
                  id={c}
                  name="cluster"
                  value={c}
                  onChange={onCheckboxClicked}
                  checked={selectedClusters.includes(c)}
                />
                {c}
              </label>
            ))}
          </TopContainer>
        </>
      )}

      <h2>{t.plotTitle[currentLib]}</h2>
      {children}
      <Content>
        {data == null ||
        availableClusters == null ||
        availableMarkers == null ? (
          <p>Chargement des données...</p>
        ) : currentLib === "sunburst" ? (
          <Sunburst />
        ) : (
          Array(numberOfPlots)
            .fill(undefined)
            .map((_, i) => (
              <ClusterSelection
                key={i}
                availableMarkers={availableMarkers}
                renderChart={({ markerX, markerY }) => (
                  <ChartComponent
                    key={i}
                    data={data}
                    markerX={markerX}
                    markerY={markerY}
                    selectedClusters={selectedClusters}
                    clusterColors={clusterColors.current}
                  />
                )}
              />
            ))
        )}
      </Content>
    </Container>
  );
};

export default Playground;
