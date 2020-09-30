import React from "react";
import styled from "@emotion/styled";
import D3WithSVG from "./D3WithSVG";
import D3WithCanvas from "./D3WithCanvas";
import D3WithHighCharts from "./D3WithHighCharts";

type PlotType = "d3svg" | "d3canvas" | "highchart";
const plotTitle: Record<PlotType, string> = {
  d3svg: "D3 avec SVG",
  d3canvas: "D3 avec Canvas",
  highchart: "High Chart",
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
  const [currentLib, setCurrentLib] = React.useState<PlotType>("d3svg");

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
      </ButtonsContainer>

      <h2>{plotTitle[currentLib]}</h2>
      {children}
      <Content>
        <ChartComponent />
      </Content>
    </Container>
  );
};

export default Playground;
