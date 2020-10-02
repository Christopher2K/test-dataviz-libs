import React from "react";
import _ from "lodash";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import SunburstModule from "highcharts/modules/sunburst";

import { SunburstCluster } from "../types";

SunburstModule(Highcharts);

type SunburstProps = {};

type HighchartDataModel = {
  id: string;
  parent: string;
  name: string;
  value: number;
};

const Sunburst: React.FC<SunburstProps> = () => {
  const [formattedData, setFormattedData] = React.useState<
    Array<HighchartDataModel>
  >();
  const [usedData, setUsedData] = React.useState<Array<HighchartDataModel>>();
  const [, setLeafs] = React.useState<Array<string>>();
  // const [option, setOptions] = React.useState<Highcharts.Options>();

  const options: Highcharts.Options = {
    title: {
      text: "",
    },
    chart: {
      zoomType: "xy",
      panning: {
        enabled: true,
        type: "xy",
      },
      panKey: "shift",
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
          format: "{point.name}",
          rotationMode: "circular",
        },
      },
    ],
  };

  const getLeafsFromData = React.useCallback(
    (leafsList: Array<string>, d: SunburstCluster) => {
      let _leafs = [...leafsList];
      _.map(d, (value, key) => {
        if (Object.keys(value.children).length === 0) {
          _leafs = [..._leafs, key];
        } else {
          _leafs = getLeafsFromData(_leafs, value.children);
        }
      });

      return _leafs;
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

  React.useEffect(() => {
    fetch("/CLUSTER.json")
      .then((resp) => resp.json())
      .then((d: SunburstCluster) => {
        const _leafs = getLeafsFromData([], d);
        setLeafs(_leafs);
        const _formattedData = mapNodeWithParents("", d, []);
        setFormattedData(_formattedData);
        setUsedData([_formattedData[0]]);
      });
  }, [getLeafsFromData, mapNodeWithParents]);

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

      console.log(updatedData.length);
      setUsedData(updatedData);
    }
  };

  return (
    <>
      {usedData && (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </>
  );
};

export default Sunburst;
