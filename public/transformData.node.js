const fs = require("fs");

fs.readFile("RAW_DATA_5.json", (e, json) => {
  if (e) return;
  const data = JSON.parse(json.toString());
  const formattedData = {};

  data.forEach((value) => {
    const { label, ...d } = value;
    if (formattedData[label]) {
      formattedData[label].push(d);
    } else {
      formattedData[label] = [d];
    }
  });

  fs.writeFile("DATA.json", JSON.stringify(formattedData), (e) => {
    if (e) {
      console.log(e);
    } else {
      console.log("done");
    }
  });
});
