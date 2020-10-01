import React, { ReactElement, useRef, useState } from "react";
import styled from "@emotion/styled";

import * as t from "../types";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ChartContainer = styled.div`
  flex: 1;
`;
const FormContainer = styled.div`
  flex: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;
const Group = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  white-space: nowrap;
`;

const Label = styled.label`
  display: flex;
`;

type RenderChartProps = {
  markerX: t.Marker;
  markerY: t.Marker;
};

type ClusterSelectionProps = {
  availableMarkers: Array<t.Marker>;
  renderChart: (props: RenderChartProps) => ReactElement;
};

const ClusterSelection: React.FC<ClusterSelectionProps> = ({
  availableMarkers,
  renderChart,
}) => {
  const [markerX, setMarkerX] = useState<t.Cluster>(availableMarkers[0]);
  const [markerY, setMarkerY] = useState<t.Cluster>(availableMarkers[1]);

  const { current: randomString } = useRef<string>(
    Math.random().toString(36).substr(2, 5)
  );

  return (
    <Container>
      <FormContainer>
        <Group>
          <p>Marker X</p>
          {availableMarkers.map((marker) => (
            <Label
              key={`${marker}X${randomString}`}
              htmlFor={`${marker}X${randomString}`}
            >
              <input
                id={`${marker}X${randomString}`}
                type="radio"
                name={`markerX${randomString}`}
                value={marker}
                checked={markerX === marker}
                onChange={() => setMarkerX(marker)}
              />
              {marker}
            </Label>
          ))}
        </Group>
        <Group>
          <p>Marker Y</p>
          {availableMarkers.map((marker) => (
            <Label
              key={`${marker}Y${randomString}`}
              htmlFor={`${marker}Y${randomString}`}
            >
              <input
                id={`${marker}Y${randomString}`}
                type="radio"
                name={`markerY${randomString}`}
                value={marker}
                checked={markerY === marker}
                onChange={() => setMarkerY(marker)}
              />
              {marker}
            </Label>
          ))}
        </Group>
      </FormContainer>
      <ChartContainer>
        {renderChart({
          markerX,
          markerY,
        })}
      </ChartContainer>
    </Container>
  );
};

export default ClusterSelection;
