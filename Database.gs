/**
 * スプレッドシートからのデータ取得（AND）
 * @param {String} spreadsheetId
 * @param {String} sheetName
 * @param {Object List} conditions
 * @param {Integer} offsetRow
 * @param {Integer} limitRow
 * @return {Object List} data
 * [Ref.]
 * const conditions = [
 *        { key: 'Name', value: 'John' }, // 名前が 'John' の行を取得
 *        { key: 'Age', value: 25 }, // 年齢が 25 の行を取得
 *        // 他の条件を追加
 * ];
 * 
 */
function databaseGet(spreadsheetId, sheetName, conditions, offsetRow, limitRow) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
  const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
  const dataRange = sheet.getDataRange(); // データの範囲を取得
  const values = dataRange.getValues(); // データを2D配列として取得
  const headers = values[0]; // ヘッダー行を取得（連想配列のキーとして使用）

  // 返却データの初期化
  let data = [];

  // データを条件でフィルタリング
  let filteredValues = [];
  if (conditions && conditions.length > 0) {
    // 値のフィルタリング
    filteredValues = values.filter(function(row) {
      return conditions.every(function(condition) {
        let key = condition.key;
        let value = condition.value;
        let columnIndex = headers.indexOf(key);
        return row[columnIndex] === value;
      });
    });
    // ヘッダー行を追加
    filteredValues.unshift(headers);
  } else { // 条件の指定がなければそのまま
    filteredValues = values;
  }

  // オフセットと最大取得数の検証
  offsetRow = !offsetRow || offsetRow < 1 ? offsetRow = 1 : offsetRow; // オフセットが未設定または１以下の場合は１に置き換え（カラムは取得しない）
  limitRow = !limitRow || offsetRow + limitRow >= filteredValues.length ? limitRow = filteredValues.length : offsetRow + limitRow; // 取得個数が未設定またはデータ数以上の場合はデータ数に置き換え

  // オフセットがデータ数以上の場合は空で返却
  if (offsetRow >= filteredValues.length) return data;

  // データの連想配列化
  for (let i = offsetRow; i < limitRow; i++) {
    let row = filteredValues[i];
    let rowData = {};
    for (let j = 0; j < headers.length; j++) {
      rowData[headers[j]] = row[j];
    }
    data.push(rowData);
  }
  return data;
}

/**
 * スプレッドシートからのデータ取得（OR）
 * @param {String} spreadsheetId
 * @param {String} sheetName
 * @param {Object List} conditions
 * @param {Integer} offsetRow
 * @param {Integer} limitRow
 * @return {Object List} data
 * [Ref.]
 * const conditions = [
 *        { key: 'Name', value: 'John' }, // 名前が 'John' の行を取得
 *        { key: 'Age', value: 25 }, // 年齢が 25 の行を取得
 *        // 他の条件を追加
 * ];
 * 
 */
function databaseOrGet(spreadsheetId, sheetName, conditions, offsetRow, limitRow) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
  const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
  const dataRange = sheet.getDataRange(); // データの範囲を取得
  const values = dataRange.getValues(); // データを2D配列として取得
  const headers = values[0]; // ヘッダー行を取得（連想配列のキーとして使用）

  // 返却データの初期化
  let data = [];

  // データを条件でフィルタリング
  let filteredValues = [];
  if (conditions && conditions.length > 0) {
    // 値のフィルタリング
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var meetsCriteria = false;
      // 条件に基づいて行をフィルタリング
      for (var j = 0; j < conditions.length; j++) {
        var key = conditions[j].key;
        var value = conditions[j].value;
        var columnIndex = headers.indexOf(key) + 1;

        if (columnIndex > 0 && row[columnIndex - 1] === value) {
          meetsCriteria = true;
          break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
        }
      }
      // 条件に合致したデータ行を追加
      if (meetsCriteria) {
        filteredValues.push(row);
      }
    }
    // ヘッダー行を追加
    filteredValues.unshift(headers);
  } else { // 条件の指定がなければそのまま
    filteredValues = values;
  }

  // オフセットと最大取得数の検証
  offsetRow = !offsetRow || offsetRow < 1 ? offsetRow = 1 : offsetRow; // オフセットが未設定または１以下の場合は１に置き換え（カラムは取得しない）
  limitRow = !limitRow || offsetRow + limitRow >= filteredValues.length ? limitRow = filteredValues.length : offsetRow + limitRow; // 取得個数が未設定またはデータ数以上の場合はデータ数に置き換え

  // オフセットがデータ数以上の場合は空で返却
  if (offsetRow >= filteredValues.length) return data;

  // データの連想配列化
  for (let i = offsetRow; i < limitRow; i++) {
    let row = filteredValues[i];
    let rowData = {};
    for (let j = 0; j < headers.length; j++) {
      rowData[headers[j]] = row[j];
    }
    data.push(rowData);
  }
  return data;
}


/**
 * スプレッドシートにデータを新規追加
 * @param {String} spreadsheetId
 * @param {String} sheetName
 * @param {Object List} keyValuePairs
 * @return {Object} 
 * [Ref.]
 * const keyValuePairs = [
 *        { key: 'Name', value: 'John' },
 *        { key: 'Age', value: 25 },
 *        // 他のデータを追加
 * ];
 */
function databaseInsert(spreadsheetId, sheetName, keyValuePairs) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
  const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
  const dataRange = sheet.getDataRange(); // データの範囲を取得
  const values = dataRange.getValues(); // データを2D配列として取得
  const headers = values[0]; // ヘッダー行を取得（連想配列のキーとして使用）

  // データをスプレッドシートへ挿入
  try {
    for (let i = 0; i < keyValuePairs.length; i++) {
      // データのマッピング
      let newRow = headers.map(function(header) {
        return keyValuePairs[i].hasOwnProperty(header) ? keyValuePairs[i][header] : null;
      });
      // データの挿入
      sheet.appendRow(newRow);
    }
    return {'result': true, 'error': ''};

  } catch (error) {
    return {'result': false, 'error': error};
  }
}


/**
 * スプレッドシートのデータを更新
 * @param {String} spreadsheetId
 * @param {String} sheetName
 * @param {Object} keyValuePair
 * @param {Object List} filterConditions
 * @return {Object} 
 * [Ref.]
 * const keyValuePair = { key: 'Name', value: 'John' };
 * const filterConditions = [
 *        { key: 'Name', value: 'John' },
 *        { key: 'Age', value: 25 },
 *        // 他のデータを追加
 * ];
 */
function databaseUpdate(spreadsheetId, sheetName, keyValuePair, filterConditions) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
  const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
  const dataRange = sheet.getDataRange(); // データの範囲を取得
  const values = dataRange.getValues(); // データを2D配列として取得
  const headers = values[0]; // ヘッダー行を取得（連想配列のキーとして使用）

  try {
    // 対象データを抽出
    const filteredRows = values.filter(function(row) {
      return filterConditions.every(function(condition) {
        let key = condition.key;
        let value = condition.value;
        let columnIndex = headers.indexOf(key);
        return columnIndex !== -1 && row[columnIndex] === value;
      });
    });
    // 対象データを更新
    for (let i = 0; i < filteredRows.length; i++) {
      let row = filteredRows[i];
      let keyIndex = headers.indexOf('key'); // キーの列を特定するための例
      if (row[keyIndex] === keyValuePair['key']) {
        for (let updateKey in keyValuePair) {
          let updateValue = keyValuePair[updateKey];
          let updateIndex = headers.indexOf(updateKey);
          if (updateIndex !== -1) {
            sheet.getRange(values.indexOf(row) + 1, updateIndex + 1).setValue(updateValue);
          }
        }
      }
    }
    return {'result': true, 'error': ''};

  } catch (error) {
    return {'result': false, 'error': error};
  }
}

/**
 * スプレッドシートのデータを削除
 * @param {String} spreadsheetId
 * @param {String} sheetName
 * @param {Object List} filterConditions
 * @return {Object} 
 * [Ref.]
 * const filterConditions = [
 *        { key: 'Name', value: 'John' },
 *        { key: 'Age', value: 25 },
 *        // 他のデータを追加
 * ];
 */
function databaseDelete(spreadsheetId, sheetName, filterConditions) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
  const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
  const dataRange = sheet.getDataRange(); // データの範囲を取得
  const values = dataRange.getValues(); // データを2D配列として取得
  const headers = values[0]; // ヘッダー行を取得（連想配列のキーとして使用）

  try {
    // 削除対象データの格納変数を初期化
    let rowsToDelete = [];
    // 削除対象データの抽出
    values.forEach(function(row, index) {
      let meetsConditions = filterConditions.every(function(condition) {
        let key = condition.key;
        let value = condition.value;
        let columnIndex = headers.indexOf(key);
        return columnIndex !== -1 && row[columnIndex] === value;
      });

      if (meetsConditions) {
        rowsToDelete.push(index + 1); // 行番号を保存
      }
    });
    // 削除の実行
    rowsToDelete.reverse().forEach(function(rowIndex) {
      sheet.deleteRow(rowIndex);
    });
    return {'result': true, 'error': ''};

  } catch (error) {
    return {'result': false, 'error': error};
  }
}

/**
 * スプレッドシートのデータを全削除（ヘッダーは除く）
 * @param {String} spreadsheetId
 * @param {String} sheetName
 * @return {Object} 
 */
function databaseTruncate(spreadsheetId, sheetName) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
  const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
  const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()); // 2行目以降のデータ範囲を取得（ヘッダーを除外）

  try {
    // 削除の実行
    dataRange.clearContent();
    return {'result': true, 'error': ''};

  } catch (error) {
    return {'result': false, 'error': error};
  }
}