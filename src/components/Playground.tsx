import React from "react";
import styled from "@emotion/styled";
import D3WithSVG from "./D3WithSVG";
import D3WithCanvas from "./D3WithCanvas";
import D3WithHighCharts from "./D3WithHighCharts";

import * as t from "../types";

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

const ButtonsContainer = styled.div`
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
  const [currentLib, setCurrentLib] = React.useState<t.PlotType>("d3svg");
  const [data, setData] = React.useState<t.Data>();
  const [availableClusters, setClusters] = React.useState<Array<t.Cluster>>();
  const [numberOfGroups, setNumberOfGroups] = React.useState(0);
  const [numberOfPlots, setNumberOfPlots] = React.useState(0);

  const ChartComponent = (() => {
    switch (currentLib) {
      case "d3svg":
        return D3WithSVG;
      case "d3canvas":
        return D3WithCanvas;
      case "highchart":
        return D3WithHighCharts;
    }
  })();

  React.useEffect(() => {
    fetch("/MOCK_DATA.json")
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
        setClusters(Object.keys(data));
      });
  }, []);

  return (
    <Container>
      <h1>Playground Dataviz #1</h1>
      <ButtonsContainer>
        <PlotButton onClick={() => setCurrentLib("d3svg")}>D3 SVG</PlotButton>
        <PlotButton onClick={() => setCurrentLib("d3canvas")}>
          D3 CANVAS
        </PlotButton>
        <PlotButton onClick={() => setCurrentLib("highchart")}>
          HIGH CHARTS
        </PlotButton>
        <PlotButton onClick={() => setNumberOfGroups(numberOfGroups + 1)}>
          Ajouter un groupe
        </PlotButton>
        <PlotButton onClick={() => setNumberOfGroups(numberOfGroups - 1)}>
          Retirer un groupe
        </PlotButton>
        <PlotButton onClick={() => setNumberOfPlots(numberOfPlots + 1)}>
          Ajouter un plot
        </PlotButton>
        <PlotButton onClick={() => setNumberOfPlots(numberOfPlots - 1)}>
          Retirer un plot
        </PlotButton>
      </ButtonsContainer>

      <h2>{t.plotTitle[currentLib]}</h2>
      {children}
      <Content>
        {data == null || availableClusters == null ? (
          <p>Chargement des données...</p>
        ) : (
          Array(numberOfPlots)
            .fill(undefined)
            .map((_, i) => (
              <ChartComponent
                key={i}
                data={data}
                availableClusters={availableClusters}
              />
            ))
        )}
      </Content>
    </Container>
  );
};

export default Playground;
