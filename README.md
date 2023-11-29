# Model & Controller Template for Google Apps Script
- Using spreadsheet as a database

## Get Data from Spreadsheet

```
const mdl = new Model();

const condtions = [
  { key: "columnName1", value: "value1" },
  { key: "columnName2", value: "value2" },
  // etc.
];

const offset = 10;
const limit = 5;

const allData = mdl.getData("sheetName");
const dataWithAnd = mdl.getData("sheetName", conditions);
const dataWithOr = mdl.orGetData("sheetName", conditions);
const dataOffsetLimit = mdl.getData("sheetName", null, offset, limit);

Logger.log(allData);
Logger.log(dataWithAnd);
Logger.log(dataWithOr);
Logger.log(dataOffsetLimit);
```