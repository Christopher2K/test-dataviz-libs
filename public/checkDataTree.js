const fs = require("fs").promises;
const _ = require("lodash");

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

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


function setTreeColors (data, obj, parentColor = '#FFFFFF') {
  const entries = _.map(data, (value, key) => {
    return [key, value.count]
  }).sort((a, b) => a[1] - b[1])

  entries.forEach(([key,], index) => {
    if (index === 0) {
      obj[key] = parentColor
    } else {
      obj[key] = getRandomColor()
    }
  })

  _.each(data, (value, key) => {
    if (Object.keys(value["children"]).length > 0) {
      obj = setTreeColors(value['children'], obj, obj[key])
    }
  })

  return obj
}

fs.readFile("CLUSTER.json").then((raw) => {
  const data = JSON.parse(raw.toString());
  console.log(setTreeColors(data, {}, '#FFFFFF'))
});
