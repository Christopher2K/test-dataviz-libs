const fs = require("fs").promises;
const _ = require("lodash");

function getLeafs(leafs, data) {
  let _leafs = [...leafs];
  _.map(data, (value, key) => {
    if (Object.keys(value["children"]).length === 0) {
      _leafs = [..._leafs, key];
    } else {
      _leafs = getLeafs(_leafs, value["children"]);
    }
  });

  return _leafs;
}

function getDepth(maxDepth, data) {
  let _maxDepth = maxDepth;
  _.map(data, (value, key) => {
    if (Object.keys(value["children"]).length === 0) {
      _maxDepth = maxDepth < value["depth"] ? value["depth"] : maxDepth;
    } else {
      _maxDepth = getDepth(_maxDepth, value["children"]);
    }
  });

  return _maxDepth;
}

fs.readFile("CLUSTER.json").then((raw) => {
  const data = JSON.parse(raw.toString());
  console.log(getDepth(0, data));
});
