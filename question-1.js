const fs = require("fs");
const csv = require("csv-parser");
const ObjectsToCsv = require("objects-to-csv");


function readFile(srcpath) {
  let obj = [];
  return new Promise(function (resolve, reject) {
    fs.createReadStream(srcpath)
      .pipe(csv())
      .on("data", (row) => {
        if (row["COUNTRY"].includes("USA")) obj.push(row);
      })
      .on("end", () => {
        resolve(obj);
      });
  });
}

function writeFile(data) {
  return new Promise(function (resolve, reject) {
    new ObjectsToCsv(data).toDisk("Output/filteredCountry.csv");
    resolve();
  });
}

readFile("Input/main.csv").then(function (data) {
  writeFile(data).then(function () {
    console.log("Successfully filtered");
  });
});