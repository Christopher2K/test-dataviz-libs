import React, { useCallback } from "react";
import styled from "@emotion/styled";
import _ from "lodash";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import SunburstModule from "highcharts/modules/sunburst";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { SunburstCluster } from "../types";

SunburstModule(Highcharts);

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

type SunburstProps = {};

type HighchartDataModel = {
  id: string;
  parent: string;
  name: string;
  value: number;
  depth: number;
};

const Sunburst: React.FC<SunburstProps> = () => {
  const [formattedData, setFormattedData] = React.useState<
    Array<HighchartDataModel>
  >();
  const [maxDepth, setMaxDepth] = React.useState<number>();
  const [usedData, setUsedData] = React.useState<Array<HighchartDataModel>>();
  const [rangeValue, setRangeValue] = React.useState(0);

  const options: Highcharts.Options = {
    title: {
      text: "",
    },
    colors: ["#da2c38", "#226f54", "#87c38f", "#f4f0bb", "#43291f"],
    chart: {
      height: 500,
      width: 600,
    },
    series: [
      {
        type: "sunburst",
        data: usedData,
        events: {
          click: function (event) {
            const pointId = ((event.point as unknown) as { id: string }).id;
            updateChilds(pointId.toString());
          },
        },
        dataLabels: {
          enabled: false,
          format: "{point.name}",
          rotationMode: "circular",
        },
      },
    ],
  };

  const getDepthFromData = React.useCallback(
    (maxDepth: number, d: SunburstCluster) => {
      let _maxDepth = maxDepth;
      _.map(d, (value, key) => {
        if (Object.keys(value.children).length === 0) {
          _maxDepth = maxDepth < value.depth ? value.depth : maxDepth;
        } else {
          _maxDepth = getDepthFromData(_maxDepth, value.children);
        }
      });

      return _maxDepth;
    },
    []
  );

  const mapNodeWithParents = React.useCallback(
    (parent: string, d: SunburstCluster, list: Array<HighchartDataModel>) => {
      let _list = [...list];
      _.map(d, (value, key) => {
        const newItem = {
          id: key,
          parent: parent,
          name: value.label,
          value: value.count,
          depth: value.depth,
        };

        const newList = [..._list, newItem];

        if (Object.keys(value.children).length === 0) {
          _list = newList;
        } else {
          _list = mapNodeWithParents(key, value.children, newList);
        }
      });
      return _list;
    },
    []
  );

  const findNodesToRemove = React.useCallback(
    (parentId: string, nodesToRemove: Array<HighchartDataModel>) => {
      if (usedData) {
        const directChilds = usedData.filter((p) => p.parent === parentId);

        let _nodesToRemoves = [...nodesToRemove, ...directChilds];

        if (directChilds.length === 0) {
          return _nodesToRemoves;
        } else {
          for (const child of directChilds) {
            _nodesToRemoves = findNodesToRemove(child.id, _nodesToRemoves);
          }

          return _nodesToRemoves;
        }
      }
      return nodesToRemove;
    },
    [usedData]
  );

  const updateChilds = (parentId: string) => {
    if (formattedData && usedData) {
      const alreadyAdded = usedData.some((d) => d.parent === parentId);
      let updatedData: Array<HighchartDataModel> = [];

      if (alreadyAdded) {
        const nodesToRemoveId = findNodesToRemove(parentId, []).map(
          (d) => d.id
        );
        updatedData = usedData.filter((d) => !nodesToRemoveId.includes(d.id));
      } else {
        const childs = formattedData.filter((d) => d.parent === parentId);
        updatedData = [...usedData, ...childs];
      }

      setUsedData(updatedData);
    }
  };

  const changeSliderValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRangeValue(+e.target.value);
    },
    []
  );

  const updateAccordingToSlider = React.useCallback(() => {
    if (formattedData) {
      setUsedData(formattedData.filter((d) => d.depth <= rangeValue));
    }
  }, [formattedData, rangeValue]);

  React.useEffect(() => {
    fetch("/CLUSTER.json")
      .then((resp) => resp.json())
      .then((d: SunburstCluster) => {
        const depth = getDepthFromData(0, d);
        setMaxDepth(depth);
        const _formattedData = mapNodeWithParents("", d, []);
        setFormattedData(_formattedData);
        setUsedData([_formattedData[0]]);
      });
  }, [getDepthFromData, mapNodeWithParents]);

  return (
    <Container>
      {usedData && (
        <TransformWrapper>
          {({
            zoomIn,
            zoomOut,
            resetTransform,
          }: Record<string, () => void>) => (
            <>
              <div className="tools">
                <button onClick={zoomIn}>+</button>
                <button onClick={zoomOut}>-</button>
                <button onClick={resetTransform}>x</button>
              </div>
              <TransformComponent>
                <HighchartsReact highcharts={Highcharts} options={options} />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      )}
      {maxDepth && (
        <div>
          <input
            type="range"
            min={1}
            max={maxDepth}
            value={rangeValue}
            onChange={changeSliderValue}
            onMouseUp={updateAccordingToSlider}
          />
        </div>
      )}
    </Container>
  );
};

export default Sunburst;
