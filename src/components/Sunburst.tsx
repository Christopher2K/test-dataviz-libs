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
  const [data, setData] = React.useState<SunburstCluster>();
  const [formattedData, setFormattedData] = React.useState<
    Array<HighchartDataModel>
  >();
  const [usedData, setUsedData] = React.useState<Array<HighchartDataModel>>();
  const [leafs, setLeafs] = React.useState<Array<string>>();
  // const [option, setOptions] = React.useState<Highcharts.Options>();

  const options: Highcharts.Options = {
    chart: {
      height: 600,
      width: 600,
    },
    series: [
      {
        type: "sunburst",
        data: usedData,
        events: {
          click: function (event) {
            const pointId = ((event.point as unknown) as { id: string }).id;
            addChilds(pointId.toString());
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

  React.useEffect(() => {
    fetch("/CLUSTER.json")
      .then((resp) => resp.json())
      .then((d) => {
        setData(d);
        const _leafs = getLeafsFromData([], d);
        setLeafs(_leafs);
        const _formattedData = mapNodeWithParents("", d, []);
        setFormattedData(_formattedData);
        setUsedData([_formattedData[0]]);
      });
  }, [getLeafsFromData, mapNodeWithParents]);

  const addChilds = (parentId: string) => {
    if (formattedData && usedData) {
      const childs = formattedData.filter((d) => d.parent === parentId);
      setUsedData([...usedData, ...childs]);
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
