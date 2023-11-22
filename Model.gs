/**
 * データ取得
 */
function modelGetData(sheetName, conditions, offsetRow, limitRow) {
  const conf = config();
  const spreadsheetId = conf.spreadsheetId; // スプレッドシートのIDを指定
  const dataList = databaseGet(spreadsheetId, sheetName, conditions, offsetRow, limitRow); // データの取得
  
  return dataList;
}

/**
 * データ挿入
 */
function modelInsertData(sheetName, keyValuePairs) {
  const conf = config();
  const spreadsheetId = conf.spreadsheetId; // スプレッドシートのIDを指定
  const result = databaseInsert(spreadsheetId, sheetName, keyValuePairs); // データの挿入
  
  return result;
}

/**
 * データ更新
 */
function modelUpdateData(sheetName, keyValuePairs, conditions) {
  const conf = config();
  const spreadsheetId = conf.spreadsheetId; // スプレッドシートのIDを指定
  const result = databaseUpdate(spreadsheetId, sheetName, keyValuePairs, conditions); // データの更新
  
  return result;
}

/**
 * データの削除
 */
function modelDeleteData(sheetName, conditions) {
  const conf = config();
  const spreadsheetId = conf.spreadsheetId; // スプレッドシートのIDを指定
  const result = databaseDelete(spreadsheetId, sheetName, conditions); // データの削除
  
  return result;
}