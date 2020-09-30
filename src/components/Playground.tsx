import React from "react";
import styled from "@emotion/styled";
import D3WithSVG from "./D3WithSVG";
import D3WithCanvas from "./D3WithCanvas";
import D3WithHighCharts from "./D3WithHighCharts";

import * as t from "../types";
import { extent, NumberValue } from "d3";
import { shuffleArray } from "../utilss";

type ResponseJson = {
  groupsLow: Array<{
    color: string;
    data: Array<{
      x: number;
      y: number;
    }>;
  }>;
  groupsMedium: Array<{
    color: string;
    data: Array<{
      x: number;
      y: number;
    }>;
  }>;
  groupsHigh: Array<{
    color: string;
    data: Array<{
      x: number;
      y: number;
    }>;
  }>;
};

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

const Content = styled.div``;

const Playground: React.FC = ({ children }) => {
  const [currentLib, setCurrentLib] = React.useState<t.PlotType>("d3svg");
  const [data, setData] = React.useState<Array<t.DotData>>();
  const [numberOfGroups, setNumberOfGroups] = React.useState(0);
  const [numberOfPlots, setNumberOfPlots] = React.useState(0);
  const [xExtent, setXextent] = React.useState<NumberValue[]>();
  const [yExtent, setYextent] = React.useState<NumberValue[]>();

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
      .then((json) => {
        const r: ResponseJson = json[0];
        const d = [...r.groupsLow, ...r.groupsMedium, ...r.groupsHigh];

        const dots = d.reduce((acc, item) => {
          return [...acc, ...item.data];
        }, [] as t.Dot[]);
        setXextent(extent(dots, (d) => d.x) as NumberValue[]);
        setYextent(extent(dots, (d) => d.y) as NumberValue[]);
        shuffleArray(d);
        setData(d);
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
        {data == null || xExtent == null || yExtent == null ? (
          <p>Chargement des données...</p>
        ) : (
          Array(numberOfPlots)
            .fill(undefined)
            .map((_, i) => (
              <ChartComponent
                key={i}
                rawData={data}
                numberOfGroups={numberOfGroups}
                xExtent={xExtent}
                yExtent={yExtent}
              />
            ))
        )}
      </Content>
    </Container>
  );
};

export default Playground;
