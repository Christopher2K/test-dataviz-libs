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

fs.readFile("CLUSTER.json").then((raw) => {
  const data = JSON.parse(raw.toString());
  console.log(getLeafs([], data));
  console.log(getLeafs([], data).length);
});
