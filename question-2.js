const fs = require("fs");
const csv = require("csv-parser");
const ObjectsToCsv = require("objects-to-csv");
var groupBy = require("group-by");

function readFile(srcpath) {
  let obj = [];
  return new Promise(function (resolve, reject) {
    fs.createReadStream(srcpath)
      .pipe(csv())
      .on("data", (row) => {
        obj.push(row);
      })
      .on("end", () => {
        resolve(obj);
      });
  });
}

function writeFile(data) {
  return new Promise(function (resolve, reject) {
    new ObjectsToCsv(data).toDisk("Output/lowestPrice.csv");
    resolve();
  });
}

readFile("Output/filteredCountry.csv").then(function (data) {
  var min = [];
  var grouped = groupBy(data, "SKU");
  Object.values(grouped).forEach(function (element) {
    element.sort((a, b) => {
      return a.PRICE - b.PRICE;
    });
    min.push({
      SKU: element[0].SKU,
      first_minimum_price: element[0].PRICE,
      second_minimum_price: element[1] ? element[1].PRICE : "NA",
    });
  });
  writeFile(min);
});